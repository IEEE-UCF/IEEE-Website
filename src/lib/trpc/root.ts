import { memberRouter } from '@/lib/trpc/routers/member';
import { createTRPCRouter, createCallerFactory } from './trpc';
import { authRouter } from './routers/auth';

export const appRouter = createTRPCRouter({
	member: memberRouter,
	auth: authRouter,
});

export type AppRouter = typeof appRouter;
export const createCaller = createCallerFactory(appRouter);
