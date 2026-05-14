import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { db } from '@/lib/database/client';
import { Projects, ProjectMembers, Members } from '@/lib/database/schema';
import { eq, and } from 'drizzle-orm';
import { publicProcedure, adminProcedure, createTRPCRouter } from '../trpc';

/**
 * Helper: given a list of project IDs, returns a map of
 * projectId → "FirstName LastName" for the member with isLead = true.
 */
async function fetchLeadNames(projectIds: string[]): Promise<Map<string, string>> {
	if (projectIds.length === 0) return new Map();

	const leads = await db
		.select({
			projectId: ProjectMembers.projectId,
			firstName: Members.firstName,
			lastName: Members.lastName,
		})
		.from(ProjectMembers)
		.innerJoin(Members, eq(ProjectMembers.memberId, Members.id))
		.where(eq(ProjectMembers.isLead, true));

	const idSet = new Set(projectIds);
	const map = new Map<string, string>();
	for (const row of leads) {
		if (idSet.has(row.projectId)) {
			map.set(row.projectId, `${row.firstName} ${row.lastName}`);
		}
	}
	return map;
}

// Validation schemas
const projectCreateSchema = z.object({
	title: z.string().min(1, 'Project title is required').max(255),
	slug: z.string().max(64).optional(),
	overview: z.string().min(1, 'Overview is required'),
	projectLead: z.string().max(255).optional(), // Temporary plain-text field
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

			const leadMap = await fetchLeadNames(projects.map((p) => p.id));

			return projects.map((project) => ({
				...project,
				// Prefer the plain-text field; fall back to the ProjectMembers join
				lead: project.projectLead ?? leadMap.get(project.id) ?? null,
			}));
		} catch (error) {
			throw new TRPCError({
				code: 'INTERNAL_SERVER_ERROR',
				message: error instanceof Error ? error.message : 'Failed to fetch projects',
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
				throw new TRPCError({ code: 'NOT_FOUND', message: 'Project not found' });
			}

			const [leadRow] = await db
				.select({ firstName: Members.firstName, lastName: Members.lastName })
				.from(ProjectMembers)
				.innerJoin(Members, eq(ProjectMembers.memberId, Members.id))
				.where(and(eq(ProjectMembers.projectId, input.id), eq(ProjectMembers.isLead, true)))
				.limit(1);

			return {
				...project,
				lead: project.projectLead ?? (leadRow ? `${leadRow.firstName} ${leadRow.lastName}` : null),
			};
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
				throw new TRPCError({ code: 'NOT_FOUND', message: 'Project not found' });
			}

			const [leadRow] = await db
				.select({ firstName: Members.firstName, lastName: Members.lastName })
				.from(ProjectMembers)
				.innerJoin(Members, eq(ProjectMembers.memberId, Members.id))
				.where(and(eq(ProjectMembers.projectId, project.id), eq(ProjectMembers.isLead, true)))
				.limit(1);

			return {
				...project,
				lead: project.projectLead ?? (leadRow ? `${leadRow.firstName} ${leadRow.lastName}` : null),
			};
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
						projectLead: input.projectLead ?? null,
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