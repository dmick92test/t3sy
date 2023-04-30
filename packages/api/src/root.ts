import { authRouter } from "./router/auth";
import { jobRouter } from "./router/job";
import { postRouter } from "./router/post";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  post: postRouter,
  auth: authRouter,
  job: jobRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
