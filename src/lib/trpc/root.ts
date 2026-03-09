import { memberRouter } from '@/lib/trpc/routers/member';
import { createTRPCRouter, createCallerFactory } from './trpc';
import { authRouter } from './routers/auth';
import { eventRouter } from './routers/event';
import { officerRouter } from './routers/officer';
import { projectRouter } from './routers/project';

export const appRouter = createTRPCRouter({
	member: memberRouter,
	auth: authRouter,
	event: eventRouter,
	officer: officerRouter,
	project: projectRouter,
});

export type AppRouter = typeof appRouter;
export const createCaller = createCallerFactory(appRouter);
