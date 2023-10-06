import { prisma } from "../../lib/prisma";
import { z } from "zod";
// import { inferAsyncReturnType, inferRouterInputs, inferRouterOutputs } from '@trpc/server';

import { publicProcedure, router } from "../../server/trpc";

export const todoRouter = router({
    getTodo: publicProcedure.input(z.number()).query(async({input})=>{
        return await prisma.todo.findUnique({
            where: {
                id: input
            }
        })
    }),
    getTodos: publicProcedure.query(async ()=>{
        return await prisma.todo.findMany({
            orderBy:{
                id: "asc"
            }
        })
    }),
    addTodo: publicProcedure.input(z.object({
        title: z.string(),
        description: z.string(),
    })).mutation(async ({input}) =>{
        return await prisma.todo.create({
            data: input
        })
    }),
    deleteTodo: publicProcedure.input(z.number()).mutation(async ({input}) => {
        return await prisma.todo.delete({
            where: {
                id: input
            }
        })
    }),
    setDone: publicProcedure.input(z.object({
        id: z.number(),
        done: z.boolean()
    })).mutation(async ({input})=>{
        return await prisma.todo.update({
            where: {
                id: input.id
            },
            data: {
                done: input.done
            }
        })
    })
})