import { prisma } from "../../lib/prisma";
import pgvector from "pgvector/utils";
import { openAiClient } from "../../lib/openAIClient";

import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import { stripIndent, oneLine } from "common-tags";
import { readFile } from "../readFIle";

export const embeddingRouter = router({
  addEmbedding: publicProcedure
    .input(z.string())
    .mutation(async ({ input: prompt }) => {
      const processedPrompt = prompt.replace(/\n/g, " ");

      try {
        const embedding = await openAiClient.embeddings.create({
          model: "text-embedding-ada-002",
          input: processedPrompt,
        });

        const vector = embedding.data[0].embedding;

        const vectorSql = pgvector.toSql(vector);

        const items: { id: number; embedding: string; document: string }[] =
          await prisma.$queryRaw`SELECT id, embedding::text, document FROM item ORDER BY embedding <-> ${vectorSql}::vector LIMIT 5`;

        const response = await openAiClient.chat.completions.create({
          messages: [
            {
              content: stripIndent`${oneLine`
          You are a helpful pdf analyser bot, and you are helping a user with a question. The user ask you a question and you use the context to answer as as well as you can.
          If you don't know the answer, respond with:
          "Sorry, I don't know how to help with that."`}

          Context sections:
          ${items[0].document}
          `,
              role: "system"
            },
            { content: processedPrompt, role: "user" }
          ],
          model: "gpt-4",
          max_tokens: 512,
          temperature: 0,
        });
        console.log("message", response.choices[0].message);
        return response.choices[0].message;
      } catch (error) {
        console.error("Error:", error);
      }
    }),

  addPdf: publicProcedure
    .input(z.string())
    .mutation(async ({ input: fileString }) => {

      // const processedText = text2.replace(/\n/g, " ");

      try {
        const data = await readFile();
        console.log("data", data);
        // const embedding = await openAiClient.embeddings.create({
        //   model: "text-embedding-ada-002",
        //   input: processedText,
        // });

        // const vector = embedding.data[0].embedding;
        // const vectorSql = pgvector.toSql(vector);

        // await prisma.$executeRaw`INSERT INTO item (embedding, document) VALUES (${vectorSql}::vector, ${processedText})`;
      } catch (error) {
        console.error("Error:", error);
      }
      return "ok";
    }),
});
