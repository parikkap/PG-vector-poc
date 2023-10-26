import { router } from './trpc'
import { embeddingRouter } from './router/embeddingRouter'

export const appRouter = router({
  bot: embeddingRouter,
})

export type AppRouterType = typeof appRouter
