import { memberRouter } from "@/lib/trpc/routers/member";
// import { authRouter } from "@/lib/trpc/routers/auth";
import { createTRPCRouter, createCallerFactory } from "./trpc";

export const appRouter = createTRPCRouter<{
//   auth: typeof authRouter;
  member: typeof memberRouter;
}>({
//   auth: authRouter,
  member: memberRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
export const createCaller = createCallerFactory(appRouter);
