import { prisma } from "../../lib/prisma";
import pgvector from "pgvector/utils";
import { openAiClient } from "../../lib/openAIClient";

import { z } from "zod";

import { publicProcedure, router } from "../trpc";
import { Prisma } from "@prisma/client";

export const embeddingRouter = router({
  addEmbedding: publicProcedure
    .input(z.string())
    .mutation(async ({ input: prompt }) => {
      const processedText = prompt.replace(/\n/g, " ");

      try {
        const embedding = await openAiClient.embeddings.create({
          model: "text-embedding-ada-002",
          input: processedText,
        });

        const vector = embedding.data[0].embedding;

        const vectorSql = pgvector.toSql(vector);

        console.log("vectorSql", vectorSql);

        // const items = await prisma.$queryRawUnsafe(
        //   `SELECT * FROM item ORDER BY embedding <-> $1::vector LIMIT 5;`,
        //   vectorSql
        // );

        const result = await prisma.$queryRaw(
          Prisma.sql`SELECT * FROM item ORDER BY embedding <-> ${vectorSql}::vector LIMIT 5;`
        );

        console.log("items", result);
      } catch (error) {
        console.error("Error:", error);
      }

      //   const response = await openAiClient.chat.completions.create({
      //     messages: [{ content: prompt, role: "user" }],
      //     model: "gpt-3.5-turbo",
      //   });

      //   console.log("response", response);
      //   console.log("response", response.choices[0].message);

      //   SELECT * FROM items ORDER BY embedding <-> '[3,1,2]' LIMIT 5;

      try {
        // return response.choices[0].message;
      } catch (error) {
        console.error("Error:", error);
        throw new Error("Error");
      }
    }),

  addPdf: publicProcedure
    .input(z.string().nullable())
    .mutation(async ({ input: prompt }) => {
      const text = `Cloud computing is the delivery of computing services over the internet. Computing services include common IT infrastructure such as virtual machines, storage, databases, and networking. Cloud services also expand the traditional IT offerings to include things like Internet of Things (IoT), machine learning (ML), and artificial intelligence (AI).

Because cloud computing uses the internet to deliver these services, it doesn’t have to be constrained by physical infrastructure the same way that a traditional datacenter is. That means if you need to increase your IT infrastructure rapidly, you don’t have to wait to build a new datacenter—you can use the cloud to rapidly expand your IT footprint.`;

      const text2 = `An on-premises data center is a group of servers that you privately own and control. Traditional cloud computing (as opposed to hybrid or private cloud computing models) involves leasing data center resources from a third-party service provider.`;

      const processedText = text2.replace(/\n/g, " ");

      try {
        const embedding = await openAiClient.embeddings.create({
          model: "text-embedding-ada-002",
          input: processedText,
        });

        const vector = embedding.data[0].embedding;
        const vectorSql = pgvector.toSql(vector);

        await prisma.$executeRaw`INSERT INTO item (embedding, document) VALUES (${vectorSql}::vector, ${processedText})`;
      } catch (error) {
        console.error("Error:", error);
      }
    }),
});
