import { db } from '@/lib/database/client';
import { Members, Users, MemberPermissions } from '@/lib/database/schema';
import { and, eq } from 'drizzle-orm';
import { publicProcedure, createTRPCRouter } from '../trpc';
import { hasStaffCapability } from '@/lib/permissions';

export const authRouter = createTRPCRouter({
	// current session
	getSession: publicProcedure.query(({ ctx }) => {
		return ctx.session;
	}),

	// check if user is authenticated
	isAuthenticated: publicProcedure.query(({ ctx }): boolean => {
		return !!ctx.session?.user;
	}),

	// check if it's a member
	isMember: publicProcedure.query(async ({ ctx }): Promise<boolean> => {
		if (!ctx.session?.user) return false;
		const [member] = await db
			.select({ id: Members.id })
			.from(Members)
			.where(eq(Members.userId, ctx.session.user.id))
			.limit(1);
		return !!member;
	}),

	// check if it is an officer
	isOfficer: publicProcedure.query(async ({ ctx }): Promise<boolean> => {
		if (!ctx.session?.user) return false;
		const [member] = await db
			.select({ officerStatus: Members.officerStatus })
			.from(Members)
			.where(eq(Members.userId, ctx.session.user.id))
			.limit(1);
		return member?.officerStatus || false;
	}),

	// check if it's an admin
	isAdmin: publicProcedure.query(async ({ ctx }): Promise<boolean> => {
		if (!ctx.session?.user) return false;
		const [member] = await db
			.select({ administrator: Members.administrator })
			.from(Members)
			.where(eq(Members.userId, ctx.session.user.id))
			.limit(1);
		return member?.administrator || false;
	}),

	// get that role if officer
	getOfficerRole: publicProcedure.query(async ({ ctx }): Promise<string | null> => {
		if (!ctx.session?.user) return null;
		const [member] = await db
			.select({ officerRole: Members.officerRole })
			.from(Members)
			.where(eq(Members.userId, ctx.session.user.id))
			.limit(1);
		return member?.officerRole || null;
	}),

	// check if it has paid dues
	hasPaidDues: publicProcedure.query(async ({ ctx }): Promise<boolean> => {
		if (!ctx.session?.user) return false;
		const [member] = await db
			.select({ duesPaid: Members.duesPaid })
			.from(Members)
			.where(eq(Members.userId, ctx.session.user.id))
			.limit(1);
		return member?.duesPaid || false;
	}),

	// get complete auth status (combines all checks)
	getAuthStatus: publicProcedure.query(async ({ ctx }) => {
		if (!ctx.session?.user) {
			return {
				isAuthenticated: false,
				isMember: false,
				isOfficer: false,
				isAdmin: false,
				hasPaidDues: false,
				officerRole: null,
				permissions: [] as string[],
				hasStaffAccess: false,
				user: null,
				member: null,
				discordAvatar: null,
			};
		}

		const [userWithDiscord] = await db
			.select()
			.from(Users)
			.where(eq(Users.id, ctx.session.user.id))
			.limit(1);

		const [member] = await db
			.select()
			.from(Members)
			.where(eq(Members.userId, ctx.session.user.id))
			.limit(1);

		let permissions: string[] = [];
		if (member) {
			const grants = await db
				.select({ permission: MemberPermissions.permission })
				.from(MemberPermissions)
				.where(and(eq(MemberPermissions.memberId, member.id), eq(MemberPermissions.active, true)));
			permissions = [...new Set(grants.map((g) => g.permission))];
		}

		let discordAvatar = userWithDiscord?.image || null;
		if (!discordAvatar && userWithDiscord?.discordId) {
			discordAvatar = `https://cdn.discordapp.com/embed/avatars/${parseInt(userWithDiscord.discordId) % 5}.png`;
		}

		const isOfficer = member?.officerStatus || false;
		const isAdmin = member?.administrator || false;

		return {
			isAuthenticated: true,
			isMember: !!member,
			isOfficer,
			isAdmin,
			hasPaidDues: member?.duesPaid || false,
			officerRole: member?.officerRole || null,
			permissions,
			// Can this person reach /staff? admin, officer, or any *staff* capability
			// (a member-facing grant like `upload_resume` does not count).
			hasStaffAccess: isAdmin || isOfficer || hasStaffCapability(permissions),
			user: ctx.session.user,
			member: member || null,
			profile: ctx.session?.user.discordId,
			discordAvatar,
		};
	}),
});