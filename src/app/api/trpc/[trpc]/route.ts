import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { appRouter } from '@/lib/trpc/root';
import { createTRPCContext } from '@/lib/trpc/trpc';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const handler = async (req: Request) => {
	const session = await getServerSession(authOptions);

	return fetchRequestHandler({
		endpoint: '/api/trpc',
		req,
		router: appRouter,
		createContext: () =>
			createTRPCContext({
				headers: req.headers,
				session,
			}),
		onError:
			process.env.NODE_ENV === 'development'
				? ({ path, error }) => {
						console.error(`tRPC failed on ${path ?? '<no-path>'}: ${error.message}`);
					}
				: undefined,
	});
};

export { handler as GET, handler as POST };
