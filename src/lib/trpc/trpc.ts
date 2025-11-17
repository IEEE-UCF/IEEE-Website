// rarely should be edited, generated with basic t3 stack config usually

import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";
import { getServerSession } from "next-auth";
import type { Session } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/index";
import { Members } from "@/lib/schema";
import { eq } from "drizzle-orm";
/**
 * Isomorphic Session getter for API requests
 */
const isomorphicGetSession = async (headers: Headers): Promise<Session | null> => {
  const authToken = headers.get("Authorization");
  
  if (authToken) {
    return getServerSession(authOptions);
  }
  
  return getServerSession(authOptions);
};

/**
 * 1. CONTEXT
 */
export const createTRPCContext = async (opts: {
  headers: Headers;
  session: Session | null;
}) => {
  const authToken = opts.headers.get("Authorization") ?? null;
  const session = await isomorphicGetSession(opts.headers);
  const source = opts.headers.get("x-trpc-source") ?? "unknown";
  
  console.log(">>> tRPC Request from", source, "by", session?.user);

  return {
    session,
    opts,
    token: authToken,
    db,
  };
};

/**
 * 2. INITIALIZATION
 */
const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter: ({ shape, error }) => ({
    ...shape,
    data: {
      ...shape.data,
      zodError: error.cause instanceof ZodError ? error.cause.flatten() : null,
    },
  }),
});

export const createCallerFactory = t.createCallerFactory;
export const createTRPCRouter = t.router;

/**
 * Timing middleware
 */
const timingMiddleware = t.middleware(async ({ next, path }) => {
  const start = Date.now();

  if (process.env.NODE_ENV === "development") {
    const waitMs = Math.floor(Math.random() * 400) + 100;
    await new Promise((resolve) => setTimeout(resolve, waitMs));
  }

  const result = await next();
  const end = Date.now();
  console.log(`[TRPC] ${path} took ${end - start}ms to execute`);

  return result;
});

/**
 * Public procedure
 */
export const publicProcedure = t.procedure.use(timingMiddleware);

/**
 * Protected procedure with proper typing
 */
export const protectedProcedure = t.procedure
  .use(timingMiddleware)
  .use(({ ctx, next }) => {
    if (!ctx.session?.user) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }
    return next({
      ctx: {
        session: ctx.session,
      },
    });
  });

// determines if officer or if admin, helper stuff

async function userIsOfficer(userId: string): Promise<boolean> {
  const member = await db
    .select({ officerStatus: Members.officerStatus })
    .from(Members)
    .where(eq(Members.userId, userId))
    .limit(1);

  return member.length > 0 && member[0]?.officerStatus === true;
}

async function userIsAdmin(userId: string): Promise<boolean> {
  const member = await db
    .select({ administrator: Members.administrator })
    .from(Members)
    .where(eq(Members.userId, userId))
    .limit(1);

  return member.length > 0 && member[0]?.administrator === true;
}

/**
 * Officer procedure
 *
 * Requires user to be logged in AND have officerStatus = true
 * Use this for officer-only features.
 */
export const officerProcedure = protectedProcedure.use(
  async ({ ctx, next }) => {
    const isOfficer = await userIsOfficer(ctx.session.user.id);
    
    if (!isOfficer) {
      throw new TRPCError({ 
        code: "FORBIDDEN",
        message: "Officer status required" 
      });
    }
    
    return next({
      ctx: {
        session: ctx.session,
      },
    });
  }
);

/**
 * Admin procedure
 *
 * Requires user to be logged in AND have administrator = true
 * Use this for admin-only features like managing members.
 */
export const adminProcedure = protectedProcedure.use(
  async ({ ctx, next }) => {
    const isAdmin = await userIsAdmin(ctx.session.user.id);
    
    if (!isAdmin) {
      throw new TRPCError({ 
        code: "FORBIDDEN",
        message: "Administrator privileges required" 
      });
    }
    
    return next({
      ctx: {
        session: ctx.session,
      },
    });
  }
);

/**
 * Member procedure
 *
 * Requires user to be logged in AND have a member profile.
 * Use this for member-only features.
 */
export const memberProcedure = protectedProcedure.use(
  async ({ ctx, next }) => {
    const member = await db
      .select()
      .from(Members)
      .where(eq(Members.userId, ctx.session.user.id))
      .limit(1);
    
    if (member.length === 0) {
      throw new TRPCError({ 
        code: "FORBIDDEN",
        message: "Member profile required. Please complete registration." 
      });
    }
    
    return next({
      ctx: {
        session: ctx.session,
        member: member[0], // Includes officerStatus, officerRole, administrator
      },
    });
  }
);
