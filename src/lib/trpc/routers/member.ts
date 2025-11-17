import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { db } from "@/lib/index";
import { Members } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { 
  protectedProcedure, 
  adminProcedure, 
  memberProcedure,
  createTRPCRouter,
  // publicProcedure
} from "../trpc";

// Validation schemas
const memberRegistrationSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(255),
  middleName: z.string().max(255).optional(),
  lastName: z.string().min(1, "Last name is required").max(255),
  personalEmail: z.string().email("Invalid email format").max(255),
  ucfEmail: z.string().email("Invalid email format").refine((email)=>email.endsWith("@ucf.edu")).max(255),
  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
  phoneNumber: z.string().max(20).optional(),
  gender: z.enum(["M", "F", "NB", "O", "PNTS"]),
  graduationYear: z.number().int().min(2020).max(2035),
  major: z.string().min(1, "Major is required").max(255),
});

const memberUpdateSchema = z.object({
  firstName: z.string().min(1).max(255).optional(),
  middleName: z.string().max(255).optional(),
  lastName: z.string().min(1).max(255).optional(),
  biography: z.string().optional(),
  phoneNumber: z.string().max(20).optional(),
  major: z.string().max(255).optional(),
  graduationYear: z.number().int().min(2020).max(2035).optional(),
  gender: z.enum(["M", "F", "NB", "O", "PNTS"]).optional(),
  resumeURL: z.string().url().optional(),
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
            discordID: discordID,
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
});