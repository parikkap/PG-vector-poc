import { router } from "./trpc";
import { todoRouter } from "./router/todoRouter";

export const appRouter = router({
    todo: todoRouter
})

export type AppRouterType = typeof appRouter
