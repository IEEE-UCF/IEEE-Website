import { NextAuthOptions } from 'next-auth';
import DiscordProvider from 'next-auth/providers/discord';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { db } from '@/lib/database/client';
import { Users, Accounts, Sessions, Members } from '@/lib/database/schema';
import type { DiscordProfile } from 'next-auth/providers/discord';
import { eq } from 'drizzle-orm';

export const authOptions: NextAuthOptions = {
	adapter: DrizzleAdapter(db, {
		usersTable: Users,
		accountsTable: Accounts,
		sessionsTable: Sessions,
	}),
	secret: process.env.NEXTAUTH_SECRET,
	providers: [
		DiscordProvider({
			clientId: process.env.DISCORD_CLIENT_ID!,
			clientSecret: process.env.DISCORD_CLIENT_SECRET!,
			authorization: 'https://discord.com/api/oauth2/authorize?scope=identify+email',
			profile: (profile: DiscordProfile) => {
				return {
					id: profile.id,
					name: profile.username,
					email: profile.email,
					image: profile.avatar
						? `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png`
						: null,
				};
			},
		}),
	],
	session: {
		strategy: 'database',
		maxAge: 10 * 24 * 60 * 60, // 10 days
	},
	pages: {
		signIn: '/auth/signin',
	},
	events: {
		// linkAccount fires after the adapter has already created the User row
		// and linked the OAuth account — safe to write discordId here.
		// This replaces the signIn callback approach which ran BEFORE the adapter
		// wrote the User row, causing the update to target a non-existent row
		// and throwing a Callback error.
		async linkAccount({ user, account, profile }) {
			if (account.provider === 'discord' && user.id) {
				const discordProfile = profile as DiscordProfile;
				try {
					await db
						.update(Users)
						.set({ discordId: discordProfile.id })
						.where(eq(Users.id, user.id));
				} catch (error) {
					console.error('Failed to write discordId to Users:', error);
					// Events don't block sign-in, so this is safe to swallow
				}
			}
		},
	},
	callbacks: {
		async session({ session, user }) {
			// Always set user.id first — if the DB queries below fail we still want
			// the user to appear authenticated rather than losing their session.
			if (!user?.id) return session;
			session.user.id = user.id;

			try {
				const [dbUser] = await db
					.select()
					.from(Users)
					.where(eq(Users.id, user.id))
					.limit(1);

				const [member] = await db
					.select()
					.from(Members)
					.where(eq(Members.userId, user.id))
					.limit(1);

				session.user.discordId = dbUser?.discordId ?? undefined;
				session.user.memberId = member?.id ?? undefined;
				session.user.officerStatus = member?.officerStatus ?? false;
				session.user.officerRole = member?.officerRole ?? undefined;
				session.user.administrator = member?.administrator ?? false;

				return session;
			} catch (error) {
				console.error('Session callback error:', error);
				return session;
			}
		},

		async redirect({ url, baseUrl }) {
			if (url.startsWith('/')) return `${baseUrl}${url}`;
			if (url.startsWith(baseUrl)) return url;
			return baseUrl;
		},
	},
	debug: process.env.NODE_ENV === 'development',
};