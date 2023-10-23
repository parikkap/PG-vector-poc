import { prisma } from "../../lib/prisma";
import pgvector from "pgvector/utils";
import { openAiClient } from "../../lib/openAIClient";

import { z } from "zod";

import { publicProcedure, router } from "../trpc";
import { stripIndent, oneLine } from "common-tags";

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

        const chatGptPrompt = stripIndent`${oneLine`
          You are a helpful pdf analyser bot, and you are helping a user with a question. The user ask you a question and you use the context to answer as as well as you can.
          
          If you don't know the answer, respond with:
          "Sorry, I don't know how to help with that."`}
      
          Context sections:
          ${items[0].document}
      
          Question: """
          ${processedPrompt}
          """
        `;
        const response = await openAiClient.chat.completions.create({
          messages: [{ content: chatGptPrompt, role: "user" }],
          model: "gpt-3.5-turbo",
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
    .input(z.string().nullable())
    .mutation(async ({ input: prompt }) => {
      const text = `Cloud computing is the delivery of computing services over the internet. Computing services include common IT infrastructure such as virtual machines, storage, databases, and networking. Cloud services also expand the traditional IT offerings to include things like Internet of Things (IoT), machine learning (ML), and artificial intelligence (AI). Because cloud computing uses the internet to deliver these services, it doesn’t have to be constrained by physical infrastructure the same way that a traditional datacenter is. That means if you need to increase your IT infrastructure rapidly, you don’t have to wait to build a new datacenter—you can use the cloud to rapidly expand your IT footprint.`;

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
