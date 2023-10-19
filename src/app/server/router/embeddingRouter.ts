import { prisma } from "../../lib/prisma";
import pgvector from 'pgvector/utils'

import { z } from "zod";

import { publicProcedure, router } from "../trpc";

export const embeddingRouter = router({
    addEmbedding: publicProcedure.input(z.string()).mutation(async ({input}) =>{

        const embedding = pgvector.toSql([1, 2, 3]);

        try {
            await prisma.$executeRaw`INSERT INTO Embeddings (embedding) VALUES (${embedding}::vector)`
        } catch {
            throw new Error("Error")
        }

        return "ok"
    }),
})