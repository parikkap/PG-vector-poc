import { router } from "./trpc";
import { embeddingRouter } from "./router/embeddingRouter";

export const appRouter = router({
    todo: embeddingRouter
})

export type AppRouterType = typeof appRouter
