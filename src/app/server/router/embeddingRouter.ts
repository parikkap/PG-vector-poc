import { prisma } from "../../lib/prisma";
import pgvector from "pgvector/utils";
import { openAiClient } from "../../lib/openAIClient";

import { z } from "zod";

import { publicProcedure, router } from "../trpc";

export const embeddingRouter = router({
  addEmbedding: publicProcedure
    .input(z.string())
    .mutation(async ({ input: prompt }) => {
      const response = await openAiClient.chat.completions.create({
        messages: [{ content: prompt, role: "user" }],
        model: "gpt-3.5-turbo",
      });

      console.log("response", response);
      console.log("response", response.choices[0].message);

      const embedding = pgvector.toSql([1, 2, 3]);
      try {
        const data =
          await prisma.$executeRaw`INSERT INTO item (embedding) VALUES (${embedding}::vector)`;
        console.log("data", data);
        return response.choices[0].message;
      } catch (error) {
        console.error("Error:", error);
        throw new Error("Error");
      }
    }),
});
