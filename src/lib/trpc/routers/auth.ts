import type { TRPCRouterRecord } from "@trpc/server";
import { db } from "@/lib/database/index";
import { Members, Users } from "@/lib/database/schema";
import { eq } from "drizzle-orm";
import { publicProcedure } from "../trpc";
// protectedprocedure not imported lol

export const authRouter = {
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
    if (!ctx.session?.user) {
      return false;
    }

    const [member] = await db
      .select({ id: Members.id })
      .from(Members)
      .where(eq(Members.userId, ctx.session.user.id))
      .limit(1);

    return !!member;
  }),

  // check if it is an officer
  isOfficer: publicProcedure.query(async ({ ctx }): Promise<boolean> => {
    if (!ctx.session?.user) {
      return false;
    }

    const [member] = await db
      .select({ officerStatus: Members.officerStatus })
      .from(Members)
      .where(eq(Members.userId, ctx.session.user.id))
      .limit(1);

    return member?.officerStatus || false;
  }),

  // check if it's an admin
  isAdmin: publicProcedure.query(async ({ ctx }): Promise<boolean> => {
    if (!ctx.session?.user) {
      return false;
    }

    const [member] = await db
      .select({ administrator: Members.administrator })
      .from(Members)
      .where(eq(Members.userId, ctx.session.user.id))
      .limit(1);

    return member?.administrator || false;
  }),

  // get that role if officer
  getOfficerRole: publicProcedure.query(async ({ ctx }): Promise<string | null> => {
    if (!ctx.session?.user) {
      return null;
    }

    const [member] = await db
      .select({ officerRole: Members.officerRole })
      .from(Members)
      .where(eq(Members.userId, ctx.session.user.id))
      .limit(1);

    return member?.officerRole || null;
  }),

  // check if it has paid dues
  hasPaidDues: publicProcedure.query(async ({ ctx }): Promise<boolean> => {
    if (!ctx.session?.user) {
      return false;
    }

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


     let discordAvatar = userWithDiscord?.image ?? null;

    if (!discordAvatar && userWithDiscord?.discordId) {
      try {
        const avatarIndex = Number(BigInt(userWithDiscord.discordId) % BigInt(6));
        discordAvatar = `https://cdn.discordapp.com/embed/avatars/${avatarIndex}.png`;
      } catch {
        // Fallback for any edge case where discordId isn't a valid BigInt
        discordAvatar = `https://cdn.discordapp.com/embed/avatars/0.png`;
      }
    }

    return {
        isAuthenticated: true,
        isMember: !!member,
        isOfficer: member?.officerStatus || false,
        isAdmin: member?.administrator || false,
        hasPaidDues: member?.duesPaid || false,
        officerRole: member?.officerRole || null,
        user: ctx.session.user,
        member: member || null,
        profile: ctx.session?.user.discordId,
        discordAvatar,
    };
  }),

} satisfies TRPCRouterRecord;