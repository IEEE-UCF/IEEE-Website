import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { db } from "@/lib/database/index";
import { Committees, CommitteeMembers, Members } from "@/lib/database/schema";
import { eq } from "drizzle-orm";
import {
  publicProcedure,
  adminProcedure,
  createTRPCRouter,
} from "../trpc";

// Validation schemas
const committeeCreateSchema = z.object({
  title: z.string().min(1, "Committee title is required").max(255),
  about: z.string().min(1, "About is required"),
  chairId: z.string().uuid("Chair ID must be a valid UUID"),
  slug: z.string().max(64).optional(),
  discordRoleId: z.string().max(64).optional(),
  active: z.boolean().optional(),
});

const committeeUpdateSchema = committeeCreateSchema.partial();

export const committeeRouter = createTRPCRouter({

  getAll: publicProcedure.query(async () => {
    try {
      return await db.select().from(Committees);
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: error instanceof Error ? error.message : "Failed to fetch committees",
      });
    }
  }),

  getById: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ input }) => {
      const [committee] = await db
        .select()
        .from(Committees)
        .where(eq(Committees.id, input.id))
        .limit(1);

      if (!committee) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Committee not found" });
      }

      return committee;
    }),

  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const [committee] = await db
        .select()
        .from(Committees)
        .where(eq(Committees.slug, input.slug))
        .limit(1);

      if (!committee) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Committee not found" });
      }

      return committee;
    }),
getMembers: publicProcedure
  .input(z.object({ committeeId: z.string().uuid() }))
  .query(async ({ input }) => {
    try {
      const members = await db
        .select({
          // CommitteeMembers join info
          committeeMemberId: CommitteeMembers.id,
          isChair: CommitteeMembers.isChair,
          // Member identity
          id: Members.id,
          firstName: Members.firstName,
          middleName: Members.middleName,
          lastName: Members.lastName,
          // Member role/status
          officerRole: Members.officerRole,
          officerStatus: Members.officerStatus,
          administrator: Members.administrator,
          duesPaid: Members.duesPaid,
          // Member contact
          personalEmail: Members.personalEmail,
          ucfEmail: Members.ucfEmail,
          phoneNumber: Members.phoneNumber,
          discordID: Members.discordID,
          // Member profile
          portraitUrl: Members.portraitUrl,
          biography: Members.biography,
          major: Members.major,
          graduationYear: Members.graduationYear,
          gender: Members.gender,
          // Member links
          linkedinURL: Members.linkedinURL,
          githubURL: Members.githubURL,
          websiteURL: Members.websiteURL,
          resumeURL: Members.resumeURL,
          // Meta
          active: Members.active,
          createdAt: Members.createdAt,
        })
        .from(CommitteeMembers)
        .innerJoin(Members, eq(CommitteeMembers.memberId, Members.id))
        .where(eq(CommitteeMembers.committeeId, input.committeeId));

      if (!members.length) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "No members found for this committee",
        });
      }

      return members;
    } catch (error) {
      if (error instanceof TRPCError) throw error;
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: error instanceof Error ? error.message : "Failed to fetch committee members",
      });
    }
  }),

  create: adminProcedure
    .input(committeeCreateSchema)
    .mutation(async ({ input }) => {
      try {
        const [newCommittee] = await db
          .insert(Committees)
          .values({
            title: input.title,
            about: input.about,
            chairId: input.chairId,
            slug: input.slug ?? null,
            discordRoleId: input.discordRoleId ?? null,
            active: input.active ?? true,
          })
          .returning();

        return { success: true, committee: newCommittee };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error instanceof Error ? error.message : "Failed to create committee",
        });
      }
    }),

  update: adminProcedure
    .input(z.object({ id: z.string().uuid(), data: committeeUpdateSchema }))
    .mutation(async ({ input }) => {
      const [updated] = await db
        .update(Committees)
        .set({ ...input.data, updatedAt: new Date() })
        .where(eq(Committees.id, input.id))
        .returning();

      if (!updated) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Committee not found" });
      }

      return { success: true, committee: updated };
    }),

  delete: adminProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ input }) => {
      const [deleted] = await db
        .delete(Committees)
        .where(eq(Committees.id, input.id))
        .returning();

      if (!deleted) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Committee not found" });
      }

      return { success: true };
    }),

  addMember: adminProcedure
    .input(z.object({
      committeeId: z.string().uuid(),
      memberId: z.string().uuid(),
      isChair: z.boolean().optional(),
    }))
    .mutation(async ({ input }) => {
      try {
        const [newMember] = await db
          .insert(CommitteeMembers)
          .values({
            committeeId: input.committeeId,
            memberId: input.memberId,
            isChair: input.isChair ?? false,
          })
          .returning();

        return { success: true, committeeMember: newMember };
      } catch (error) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Member is already in this committee",
        });
      }
    }),

  removeMember: adminProcedure
    .input(z.object({
      committeeId: z.string().uuid(),
      memberId: z.string().uuid(),
    }))
    .mutation(async ({ input }) => {
      const [removed] = await db
        .delete(CommitteeMembers)
        .where(
          eq(CommitteeMembers.committeeId, input.committeeId) &&
          eq(CommitteeMembers.memberId, input.memberId)
        )
        .returning();

      if (!removed) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Member not found in this committee" });
      }

      return { success: true };
    }),
});