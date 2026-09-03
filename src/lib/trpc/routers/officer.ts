import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { db } from "@/lib/database/client";
import { Members } from "@/lib/database/schema";
import { eq, isNotNull, desc } from "drizzle-orm";
import {
	publicProcedure,
	adminProcedure,
	capabilityProcedure,
	createTRPCRouter,
} from "../trpc";

const reviewResumes = capabilityProcedure("review_resumes");

const officerPublicFields = {
	id: Members.id,
	firstName: Members.firstName,
	lastName: Members.lastName,
	officerRole: Members.officerRole,
	biography: Members.biography,
	portraitUrl: Members.portraitUrl,
	linkedinURL: Members.linkedinURL,
	githubURL: Members.githubURL,
	websiteURL: Members.websiteURL,
};

export const officerRouter = createTRPCRouter({

	// Get all current officers
	getAll: publicProcedure.query(async () => {
		try {
			const officers = await db
				.select(officerPublicFields)
				.from(Members)
				.where(eq(Members.officerStatus, true));
			return officers;
		} catch (error) {
			throw new TRPCError({
				code: "INTERNAL_SERVER_ERROR",
				message: error instanceof Error ? error.message : "Failed to fetch officers",
			});
		}
	}),

	// Get a single officer by member id
	getById: publicProcedure
		.input(z.object({ id: z.string().uuid() }))
		.query(async ({ input }) => {
			const [officer] = await db
				.select(officerPublicFields)
				.from(Members)
				.where(eq(Members.id, input.id))
				.limit(1);

			if (!officer?.officerRole) {
				throw new TRPCError({ code: "NOT_FOUND", message: "Officer not found" });
			}

			return officer;
		}),

	// Promote a member to officer (admin only)
	promote: adminProcedure
		.input(z.object({
			id: z.string().uuid(),
			officerRole: z.enum([
				"Executive Chair",
				"Vice Chair",
				"Treasurer",
				"Secretary",
				"Project Chair",
				"Workshop Chair",
				"Conference Chair",
				"Outreach Chair",
				"Service Chair",
				"Social Chair",
				"Professional Development Chair",
				"Marketing Chair",
				"Software Chair",
			]),
		}))
		.mutation(async ({ input }) => {
			const [updated] = await db
				.update(Members)
				.set({ officerStatus: true, officerRole: input.officerRole })
				.where(eq(Members.id, input.id))
				.returning();

			if (!updated) {
				throw new TRPCError({ code: "NOT_FOUND", message: "Member not found" });
			}

			return { success: true, officer: updated };
		}),

	// Resume dashboard: all members, with resume status. Officer/admin only.
	listResumes: reviewResumes.query(async () => {
		const rows = await db
			.select({
				memberId: Members.id,
				firstName: Members.firstName,
				lastName: Members.lastName,
				major: Members.major,
				graduationYear: Members.graduationYear,
				resumeFileName: Members.resumeFileName,
				resumeUploadedAt: Members.resumeUploadedAt,
				resumeUrl: Members.resumeURL,
				resumeOnedrivePath: Members.resumeOnedrivePath,
				hasResume: isNotNull(Members.resumeKey),
			})
			.from(Members)
			.orderBy(desc(Members.resumeUploadedAt), Members.lastName);
		return rows;
	}),

	// Remove officer status (admin only)
	demote: adminProcedure
		.input(z.object({ id: z.string().uuid() }))
		.mutation(async ({ input }) => {
			const [updated] = await db
				.update(Members)
				.set({ officerStatus: false, officerRole: null })
				.where(eq(Members.id, input.id))
				.returning();

			if (!updated) {
				throw new TRPCError({ code: "NOT_FOUND", message: "Member not found" });
			}

			return { success: true, member: updated };
		}),
});