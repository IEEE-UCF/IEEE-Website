import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { db } from "@/lib/database/client";
import { Members } from "@/lib/database/schema";
import { eq } from "drizzle-orm";
import {
	publicProcedure,
	adminProcedure,
	createTRPCRouter,
} from "../trpc";

export const officerRouter = createTRPCRouter({

	// Get all current officers
	getAll: publicProcedure.query(async () => {
		try {
			const officers = await db
				.select()
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
				.select()
				.from(Members)
				.where(eq(Members.id, input.id))
				.limit(1);

			if (!officer?.officerStatus) {
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