import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { db } from "@/lib/index";
import { Members } from "@/lib/schema";
import { eq, and, or, ilike, desc, asc } from "drizzle-orm";
import { 
  protectedProcedure, 
  adminProcedure, 
  publicProcedure,
  officerProcedure,
  memberProcedure 
} from "../trpc";

// Validation schemas
const memberRegistrationSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(255),
  middleName: z.string().max(255).optional(),
  lastName: z.string().min(1, "Last name is required").max(255),
  email: z.string().email("Invalid UCF email format").max(255),
  personalEmail: z.string().email("Invalid personal email format").max(255).optional(),
  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
  phoneNumber: z.string().max(20).optional(),
  gender: z.enum(["M", "F", "NB", "O", "PNTS"]),
  graduationYear: z.number().int().min(2020).max(2035),
  major: z.string().min(1, "Major is required").max(255),
  discordID: z.string().min(1, "Discord ID is required").max(64),
});

const memberUpdateSchema = z.object({
  firstName: z.string().min(1).max(255).optional(),
  middleName: z.string().max(255).optional(),
  lastName: z.string().min(1).max(255).optional(),
  biography: z.string().optional(),
  phoneNumber: z.string().max(20).optional(),
  major: z.string().max(255).optional(),
  resumeURL: z.string().url().optional(),
  linkedinURL: z.string().url().optional(),
  githubURL: z.string().url().optional(),
  websiteURL: z.string().url().optional(),
  personalEmail: z.string().email().optional(),
});

export const memberRouter = {
  // Complete registration after Discord OAuth (protected - user is already authenticated via Discord)
  completeRegistration: protectedProcedure
    .input(memberRegistrationSchema.omit({ discordID: true }))
    .mutation(async ({ ctx, input }) => {
      try {
        // Check if member profile already exists for this user
        const existingMember = await db
          .select()
          .from(Members)
          .where(eq(Members.userId, ctx.session.user.id))
          .limit(1);

        if (existingMember.length > 0) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Member profile already exists",
          });
        }

        // // Check if email is already used by another member
        // const emailExists = await db
        //   .select()
        //   .from(Members)
        //   .where(eq(Members.email, input.email))
        //   .limit(1);

        // if (emailExists.length > 0) {
        //   throw new TRPCError({
        //     code: "CONFLICT",
        //     message: "This email is already registered",
        //   });
        // }

        // Get Discord ID from ctx (assuming it's stored in user object from Discord OAuth)
        const discordID = ctx.session.user.discordId || ctx.session.user.id; // Adjust based on your auth setup

        // Create new member profile
        const newMember = await db
          .insert(Members)
          .values({
            userId: ctx.session.user.id,
            discordID: discordID,
            firstName: input.firstName,
            middleName: input.middleName || null,
            lastName: input.lastName,
            email: input.email,
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
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to complete registration",
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

  getById: protectedProcedure
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

}