import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { db } from "@/lib/database/index";
import { Projects } from "@/lib/database/schema";
import { eq } from "drizzle-orm";
import {
  publicProcedure,
  adminProcedure,
  createTRPCRouter,
} from "../trpc";

// Validation schemas
const projectCreateSchema = z.object({
  title: z.string().min(1, "Project title is required").max(255),
  slug: z.string().max(64).optional(),
  overview: z.string().min(1, "Overview is required"),
  hardwareInfo: z.string().optional(),
  softwareInfo: z.string().optional(),
  skills: z.string().optional(),
  photoUrls: z.array(z.string()).optional(),
  discordRoleId: z.string().max(64).optional(),
});

const projectUpdateSchema = projectCreateSchema.partial();

export const projectRouter = createTRPCRouter({

  getAll: publicProcedure.query(async () => {
    try {
      const projects = await db
        .select()
        .from(Projects)
        .where(eq(Projects.active, true));
      return projects;
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: error instanceof Error ? error.message : "Failed to fetch projects",
      });
    }
  }),

  getById: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ input }) => {
      const [project] = await db
        .select()
        .from(Projects)
        .where(eq(Projects.id, input.id))
        .limit(1);

      if (!project) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Project not found" });
      }

      return project;
    }),

  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const [project] = await db
        .select()
        .from(Projects)
        .where(eq(Projects.slug, input.slug))
        .limit(1);

      if (!project) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Project not found" });
      }

      return project;
    }),

  create: adminProcedure
    .input(projectCreateSchema)
    .mutation(async ({ input }) => {
      try {
        const newProject = await db
          .insert(Projects)
          .values({
            title: input.title,
            slug: input.slug ?? null,
            overview: input.overview,
            hardwareInfo: input.hardwareInfo ?? null,
            softwareInfo: input.softwareInfo ?? null,
            skills: input.skills ?? null,
            photoUrls: input.photoUrls ?? null,
            discordRoleId: input.discordRoleId ?? null,
          })
          .returning();

        return { success: true, project: newProject[0] };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error instanceof Error ? error.message : "Failed to create project",
        });
      }
    }),

  update: adminProcedure
    .input(z.object({ id: z.string().uuid(), data: projectUpdateSchema }))
    .mutation(async ({ input }) => {
      const [updated] = await db
        .update(Projects)
        .set({ ...input.data, updatedAt: new Date() })
        .where(eq(Projects.id, input.id))
        .returning();

      if (!updated) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Project not found" });
      }

      return { success: true, project: updated };
    }),

  delete: adminProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ input }) => {
      const [deleted] = await db
        .delete(Projects)
        .where(eq(Projects.id, input.id))
        .returning();

      if (!deleted) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Project not found" });
      }

      return { success: true };
    }),
});