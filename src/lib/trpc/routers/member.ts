import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { db } from "@/lib/database/client";
import {
	Members,
	Users,
	Committees,
	CommitteeMembers,
	MemberPermissions,
	majorEnums,
	officerRoleEnum,
} from "@/lib/database/schema";
import { and, eq, inArray } from "drizzle-orm";
import {
	protectedProcedure,
	adminProcedure,
	memberProcedure,
	officerProcedure,
	createTRPCRouter,
	// publicProcedure
} from "../trpc";
import { CAPABILITY_KEYS, isCapability, isOfficerDelegable } from "@/lib/permissions";
import { getOfficerGrantableCapabilities } from "@/lib/settings";

// Validation schemas
const memberRegistrationSchema = z.object({
	firstName: z.string().min(1, "First name is required").max(255),
	middleName: z.string().max(255).optional(),
	lastName: z.string().min(1, "Last name is required").max(255),
	personalEmail: z.string().email("Invalid email format").max(255),
	ucfEmail: z.string().email("Invalid email format").refine((email) => email.endsWith("@ucf.edu")).max(255),
	dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
	phoneNumber: z.string().max(20).optional(),
	gender: z.enum(["M", "F", "NB", "O", "PNTS"]),
	graduationYear: z.number().int().min(2020).max(2035),
	major: z.enum(majorEnums.enumValues),
});

const memberUpdateSchema = z.object({
	firstName: z.string().min(1).max(255).optional(),
	middleName: z.string().max(255).optional(),
	lastName: z.string().min(1).max(255).optional(),
	biography: z.string().optional(),
	phoneNumber: z.string().max(20).optional(),
	major: z.enum(majorEnums.enumValues),
	graduationYear: z.number().int().min(2020).max(2035).optional(),
	gender: z.enum(["M", "F", "NB", "O", "PNTS"]).optional(),
	linkedinURL: z.string().url().optional(),
	githubURL: z.string().url().optional(),
	websiteURL: z.string().url().optional(),
});

// create all these damn routers
export const memberRouter = createTRPCRouter({

	// for member creation and registration checking
	completeRegistration: protectedProcedure
		.input(memberRegistrationSchema)
		.mutation(async ({ ctx, input }) => {

			try {
				// search to see if they exist
				const existingMember = await db
					.select()
					.from(Members)
					.where(eq(Members.userId, ctx.session.user.id))
					.limit(1);

				if (existingMember.length > 0) {
					throw new TRPCError({
						code: "CONFLICT",
						message: "member profile already exists!",
					});
				}

				// collect the discord id from the user or session created when they logged in with discord auth
				const discordID = ctx.session.user.discordId || ctx.session.user.id;

				// insert the new member
				const newMember = await db
					.insert(Members)
					.values({
						userId: ctx.session.user.id,
						discordId: discordID,
						firstName: input.firstName,
						middleName: input.middleName || null,
						lastName: input.lastName,
						personalEmail: input.personalEmail,
						ucfEmail: input.ucfEmail,
						dateOfBirth: input.dateOfBirth,
						phoneNumber: input.phoneNumber || null,
						gender: input.gender,
						graduationYear: input.graduationYear,
						major: input.major,
						officerStatus: false,
						administrator: false,
						duesPaid: false,
						active: true,
						officerRole: null,
						biography: null,
						resumeURL: null,
						linkedinURL: null,
						githubURL: null,
						websiteURL: null,
					})
					.returning();


				return {
					success: true,
					member: newMember[0],
				};
			} catch (error) {

				// error with completion
				if (error instanceof TRPCError) throw error;
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: error instanceof Error ? error.message : "Failed to complete registration",
				});
			}

		}),

	updateMyProfile: memberProcedure
		.input(memberUpdateSchema)
		.mutation(async ({ ctx, input }) => {
			const [updated] = await db
				.update(Members)
				.set({ ...input, updatedAt: new Date() })
				.where(eq(Members.userId, ctx.session.user.id))
				.returning();

			if (!updated) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Profile not found",
				});
			}

			return { success: true, member: updated };
		}),

	getAll: adminProcedure.query(async () => {
		const members = await db.select().from(Members);
		return members;
	}),

	/**
	 * Rich member list for the members-management screen:
	 * status flags, résumé indicator, committees, and linked Discord account.
	 * Officers may view it (they can only act on delegated capabilities — see setPermission).
	 */
	listForAdmin: officerProcedure.query(async () => {
		const rows = await db
			.select({
				id: Members.id,
				userId: Members.userId,
				firstName: Members.firstName,
				middleName: Members.middleName,
				lastName: Members.lastName,
				personalEmail: Members.personalEmail,
				ucfEmail: Members.ucfEmail,
				major: Members.major,
				graduationYear: Members.graduationYear,
				administrator: Members.administrator,
				officerStatus: Members.officerStatus,
				officerRole: Members.officerRole,
				duesPaid: Members.duesPaid,
				active: Members.active,
				memberDiscordId: Members.discordId,
				resumeUploadedAt: Members.resumeUploadedAt,
				hasResume: Members.resumeKey,
				resumeUrl: Members.resumeURL,
				createdAt: Members.createdAt,
				userName: Users.name,
				userEmail: Users.email,
				userDiscordId: Users.discordId,
			})
			.from(Members)
			.leftJoin(Users, eq(Members.userId, Users.id))
			.orderBy(Members.lastName, Members.firstName);

		const memberIds = rows.map((r) => r.id);

		// inArray([]) is a safe no-match in drizzle, so no length guard needed.
		const committeeLinks = await db
			.select({
				memberId: CommitteeMembers.memberId,
				committeeId: CommitteeMembers.committeeId,
				isChair: CommitteeMembers.isChair,
				title: Committees.title,
				slug: Committees.slug,
			})
			.from(CommitteeMembers)
			.innerJoin(Committees, eq(CommitteeMembers.committeeId, Committees.id))
			.where(inArray(CommitteeMembers.memberId, memberIds));

		const byMember = new Map<string, typeof committeeLinks>();
		for (const link of committeeLinks) {
			const list = byMember.get(link.memberId) ?? [];
			list.push(link);
			byMember.set(link.memberId, list);
		}

		const permRows = await db
			.select({ memberId: MemberPermissions.memberId, permission: MemberPermissions.permission })
			.from(MemberPermissions)
			.where(and(inArray(MemberPermissions.memberId, memberIds), eq(MemberPermissions.active, true)));
		const permsByMember = new Map<string, string[]>();
		for (const p of permRows) {
			const list = permsByMember.get(p.memberId) ?? [];
			if (!list.includes(p.permission)) list.push(p.permission);
			permsByMember.set(p.memberId, list);
		}

		return rows.map((r) => ({
			...r,
			hasResume: Boolean(r.hasResume),
			discordLinked: Boolean(r.userDiscordId || r.memberDiscordId),
			discordId: r.userDiscordId ?? r.memberDiscordId ?? null,
			committees: (byMember.get(r.id) ?? []).map((c) => ({
				id: c.committeeId,
				title: c.title,
				slug: c.slug,
				isChair: c.isChair,
			})),
			permissions: permsByMember.get(r.id) ?? [],
		}));
	}),

	/**
	 * Grant / revoke a granular capability (global scope).
	 *
	 * Admins may grant any capability to anyone. Officers may only grant/revoke a
	 * capability that an admin has delegated (settings.officerGrantableCapabilities,
	 * always a subset of OFFICER_DELEGABLE_CAPABILITIES) and only to plain members
	 * — never to other officers or admins.
	 */
	setPermission: officerProcedure
		.input(
			z.object({
				memberId: z.string().uuid(),
				permission: z.string().max(64),
				granted: z.boolean(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			if (!isCapability(input.permission)) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: `Unknown capability. Valid: ${CAPABILITY_KEYS.join(", ")}`,
				});
			}

			const [target] = await db
				.select({
					id: Members.id,
					administrator: Members.administrator,
					officerStatus: Members.officerStatus,
				})
				.from(Members)
				.where(eq(Members.id, input.memberId))
				.limit(1);
			if (!target) throw new TRPCError({ code: "NOT_FOUND", message: "Member not found" });

			// Officer (non-admin) delegation checks.
			if (!ctx.roles.administrator) {
				const allowed = await getOfficerGrantableCapabilities();
				if (!isOfficerDelegable(input.permission) || !allowed.includes(input.permission)) {
					throw new TRPCError({
						code: "FORBIDDEN",
						message: "Officers aren't allowed to grant this capability.",
					});
				}
				if (target.administrator || target.officerStatus) {
					throw new TRPCError({
						code: "FORBIDDEN",
						message: "Officers can only change capabilities for regular members.",
					});
				}
			}

			// Clear any existing global rows for this capability, then re-add if granting.
			await db
				.delete(MemberPermissions)
				.where(
					and(
						eq(MemberPermissions.memberId, input.memberId),
						eq(MemberPermissions.permission, input.permission),
						eq(MemberPermissions.contextType, "global"),
					),
				);

			if (input.granted) {
				const [grantedByMember] = await db
					.select({ id: Members.id })
					.from(Members)
					.where(eq(Members.userId, ctx.session.user.id))
					.limit(1);
				await db.insert(MemberPermissions).values({
					memberId: input.memberId,
					grantedById: grantedByMember?.id ?? null,
					contextType: "global",
					contextId: null,
					permission: input.permission,
					active: true,
				});
			}

			return { success: true, permission: input.permission, granted: input.granted };
		}),

	/** Grant / revoke administrator. Cannot remove your own admin (lockout guard). */
	setAdmin: adminProcedure
		.input(z.object({ id: z.string().uuid(), value: z.boolean() }))
		.mutation(async ({ ctx, input }) => {
			const [self] = await db
				.select({ id: Members.id })
				.from(Members)
				.where(eq(Members.userId, ctx.session.user.id))
				.limit(1);
			if (self?.id === input.id && input.value === false) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "You can't remove your own administrator access.",
				});
			}

			const [updated] = await db
				.update(Members)
				.set({ administrator: input.value, updatedAt: new Date() })
				.where(eq(Members.id, input.id))
				.returning();
			if (!updated) throw new TRPCError({ code: "NOT_FOUND", message: "Member not found" });
			return { success: true, member: updated };
		}),

	/** Set officer status and (optionally) role in one call. Clearing status clears the role. */
	setOfficer: adminProcedure
		.input(
			z.object({
				id: z.string().uuid(),
				officerStatus: z.boolean(),
				officerRole: z.enum(officerRoleEnum.enumValues).nullish(),
			}),
		)
		.mutation(async ({ input }) => {
			const [updated] = await db
				.update(Members)
				.set({
					officerStatus: input.officerStatus,
					officerRole: input.officerStatus ? (input.officerRole ?? null) : null,
					updatedAt: new Date(),
				})
				.where(eq(Members.id, input.id))
				.returning();
			if (!updated) throw new TRPCError({ code: "NOT_FOUND", message: "Member not found" });
			return { success: true, member: updated };
		}),

	getById: officerProcedure
		.input(z.object({ id: z.string().uuid() }))
		.query(async ({ input }) => {
			const [member] = await db
				.select()
				.from(Members)
				.where(eq(Members.id, input.id))
				.limit(1);

			if (!member) {
				throw new TRPCError({ code: "NOT_FOUND", message: "Member not found" });
			}

			return member;
		}),

	getMyProfile: memberProcedure.query(async ({ ctx }) => {
		const [member] = await db
			.select()
			.from(Members)
			.where(eq(Members.userId, ctx.session.user.id))
			.limit(1);

		if (!member) {
			throw new TRPCError({
				code: "NOT_FOUND",
				message: "No member profile found",
			});
		}

		return member;
	}),
});