import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { db } from '@/lib/database/client';
import { Awards } from '@/lib/database/schema';
import { eq, and, desc } from 'drizzle-orm';
import { publicProcedure, adminProcedure, createTRPCRouter } from '../trpc';

const awardCreateSchema = z.object({
	category: z.string().min(1).max(255),
	eventName: z.string().min(1).max(255),
	place: z.string().min(1).max(64),
	year: z.number().int().min(2000).max(2100),
	projectId: z.string().uuid().optional(),
	memberId: z.string().uuid().optional(),
	description: z.string().optional(),
});

const awardUpdateSchema = awardCreateSchema.partial();

export const awardRouter = createTRPCRouter({
	getAll: publicProcedure
		.input(z.object({ year: z.number().int().optional() }).optional())
		.query(async ({ input }) => {
			try {
				const conditions = [eq(Awards.active, true)];
				if (input?.year !== undefined) {
					conditions.push(eq(Awards.year, input.year));
				}

				return await db
					.select()
					.from(Awards)
					.where(and(...conditions))
					.orderBy(desc(Awards.year));
			} catch (error) {
				throw new TRPCError({
					code: 'INTERNAL_SERVER_ERROR',
					message: error instanceof Error ? error.message : 'Failed to fetch awards',
				});
			}
		}),

	getById: publicProcedure
		.input(z.object({ id: z.string().uuid() }))
		.query(async ({ input }) => {
			const [award] = await db
				.select()
				.from(Awards)
				.where(eq(Awards.id, input.id))
				.limit(1);

			if (!award) {
				throw new TRPCError({ code: 'NOT_FOUND', message: 'Award not found' });
			}

			return award;
		}),

	create: adminProcedure
		.input(awardCreateSchema)
		.mutation(async ({ input }) => {
			const [award] = await db
				.insert(Awards)
				.values({
					category: input.category,
					eventName: input.eventName,
					place: input.place,
					year: input.year,
					projectId: input.projectId ?? null,
					memberId: input.memberId ?? null,
					description: input.description ?? null,
				})
				.returning();

			return { success: true, award };
		}),

	update: adminProcedure
		.input(z.object({ id: z.string().uuid(), data: awardUpdateSchema }))
		.mutation(async ({ input }) => {
			const [updated] = await db
				.update(Awards)
				.set(input.data)
				.where(eq(Awards.id, input.id))
				.returning();

			if (!updated) {
				throw new TRPCError({ code: 'NOT_FOUND', message: 'Award not found' });
			}

			return { success: true, award: updated };
		}),

	delete: adminProcedure
		.input(z.object({ id: z.string().uuid() }))
		.mutation(async ({ input }) => {
			const [deleted] = await db
				.delete(Awards)
				.where(eq(Awards.id, input.id))
				.returning();

			if (!deleted) {
				throw new TRPCError({ code: 'NOT_FOUND', message: 'Award not found' });
			}

			return { success: true };
		}),
});
