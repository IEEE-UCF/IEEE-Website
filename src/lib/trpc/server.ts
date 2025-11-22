import 'server-only';

import { createCallerFactory } from './trpc';
import { appRouter } from './root';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createTRPCContext } from './trpc';

const createCaller = createCallerFactory(appRouter);

export const serverTrpc = async () => {
	const session = await getServerSession(authOptions);

	return createCaller(
		await createTRPCContext({
			headers: new Headers(),
			session,
		}),
	);
};
