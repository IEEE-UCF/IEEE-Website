import { memberRouter } from "@/lib/trpc/routers/member";
import { createTRPCRouter, createCallerFactory } from "./trpc";

export const appRouter = createTRPCRouter({
  member: memberRouter,
});

export type AppRouter = typeof appRouter;
export const createCaller = createCallerFactory(appRouter);