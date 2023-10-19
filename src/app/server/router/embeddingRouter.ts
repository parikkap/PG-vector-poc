import { prisma } from "../../lib/prisma";
import pgvector from 'pgvector/utils'

import { z } from "zod";

import { publicProcedure, router } from "../trpc";

export const embeddingRouter = router({
    addEmbedding: publicProcedure.input(z.string()).mutation(async ({input}) =>{
        const embedding = pgvector.toSql([1, 2, 3]);
        try {
            const data = await prisma.$executeRaw`INSERT INTO item (embedding) VALUES (${embedding}::vector)`
            console.log("data",data)
            return data
        } catch (error) {
            console.error("Error:", error);
            throw new Error("Error");
        }
    }),
})