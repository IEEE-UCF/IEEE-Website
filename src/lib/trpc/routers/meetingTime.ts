import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { db } from '@/lib/database/client';
import { MeetingTimes } from '@/lib/database/schema';
import { eq, asc } from 'drizzle-orm';
import { publicProcedure, adminProcedure, createTRPCRouter } from '../trpc';

const meetingTimeCreateSchema = z.object({
	title: z.string().min(1).max(255),
	dayOfWeek: z.number().int().min(0).max(6),
	startTime: z.string().min(1).max(8),
	endTime: z.string().min(1).max(8).optional(),
	location: z.string().max(255).optional(),
});

const meetingTimeUpdateSchema = meetingTimeCreateSchema.partial();

export const meetingTimeRouter = createTRPCRouter({
	getAll: publicProcedure.query(async () => {
		try {
			return await db
				.select()
				.from(MeetingTimes)
				.where(eq(MeetingTimes.active, true))
				.orderBy(asc(MeetingTimes.dayOfWeek), asc(MeetingTimes.startTime));
		} catch (error) {
			throw new TRPCError({
				code: 'INTERNAL_SERVER_ERROR',
				message: error instanceof Error ? error.message : 'Failed to fetch meeting times',
			});
		}
	}),

	create: adminProcedure
		.input(meetingTimeCreateSchema)
		.mutation(async ({ input }) => {
			const [meetingTime] = await db
				.insert(MeetingTimes)
				.values({
					title: input.title,
					dayOfWeek: input.dayOfWeek,
					startTime: input.startTime,
					endTime: input.endTime ?? null,
					location: input.location ?? null,
				})
				.returning();

			return { success: true, meetingTime };
		}),

	update: adminProcedure
		.input(z.object({ id: z.string().uuid(), data: meetingTimeUpdateSchema }))
		.mutation(async ({ input }) => {
			const [updated] = await db
				.update(MeetingTimes)
				.set(input.data)
				.where(eq(MeetingTimes.id, input.id))
				.returning();

			if (!updated) {
				throw new TRPCError({ code: 'NOT_FOUND', message: 'Meeting time not found' });
			}

			return { success: true, meetingTime: updated };
		}),

	delete: adminProcedure
		.input(z.object({ id: z.string().uuid() }))
		.mutation(async ({ input }) => {
			const [deleted] = await db
				.delete(MeetingTimes)
				.where(eq(MeetingTimes.id, input.id))
				.returning();

			if (!deleted) {
				throw new TRPCError({ code: 'NOT_FOUND', message: 'Meeting time not found' });
			}

			return { success: true };
		}),
});
