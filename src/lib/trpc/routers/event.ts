import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { db } from '@/lib/database/client';
import { Events, EventAttendees, Members } from '@/lib/database/schema';
import { eq, asc, and } from 'drizzle-orm';
import { publicProcedure, adminProcedure, officerProcedure, createTRPCRouter } from '../trpc';
import { DateTime } from 'luxon';

// Helper to convert a Postgres timestamptz string to an Eastern time display string.
//
// schema.ts uses mode: 'string' on all timestamp columns, so Drizzle returns the raw
// Postgres wire format: "2026-03-09 19:30:00+00" — note the SPACE instead of 'T'.
// DateTime.fromISO() requires ISO 8601 with a 'T' separator and will return Invalid
// if given a space-separated string, producing wrong/blank times on the frontend.
//
// Fix: normalise to ISO 8601 before parsing, then let Luxon handle the timezone offset.
function toEasternTime(time: string): string {
	// Replace the space between date and time with 'T' to make it valid ISO 8601.
	// Also normalise "+00" → "+00:00" if present (Postgres sometimes omits the minutes).
	const iso = time
		.replace(' ', 'T')                    // "2026-03-09 19:30:00+00" → "2026-03-09T19:30:00+00"
		.replace(/([+-]\d{2})$/, '$1:00');     // "+00" → "+00:00"  (no-op if already "+00:00")

	const dt = DateTime.fromISO(iso);         // Luxon reads the offset from the string itself

	if (!dt.isValid) {
		console.warn('[toEasternTime] Failed to parse timestamp:', time, '→', iso, dt.invalidReason);
		return time; // fall back to raw string rather than showing nothing
	}

	return dt.setZone('America/New_York').toFormat('MMMM d, yyyy h:mm a');
}

// Validation schemas
const eventCreateSchema = z.object({
	title: z.string().min(1, 'Event title is required').max(255),
	description: z.string().min(1, 'Description is required'),
	location: z.string().min(1, 'Location is required').max(255),
	startTime: z.string(),
	endTime: z.string().optional(),
	committeeId: z.string().uuid().optional(),
	flyerUrl: z.string().max(500).optional(),
	rsvpLink: z.string().max(500).optional(),
	slug: z.string().max(64).optional(),
	requiresDues: z.boolean().optional(),
});

const eventUpdateSchema = eventCreateSchema.partial();

export const eventRouter = createTRPCRouter({
	getAll: publicProcedure.query(async () => {
		try {
			const events = await db
				.select()
				.from(Events)
				.where(eq(Events.active, true))
				.orderBy(asc(Events.startTime));
			return events.map((event) => ({
				...event,
				// Human-readable Eastern string for display: "March 9, 2026 7:30 PM"
				startTime: toEasternTime(event.startTime),
				endTime: event.endTime ? toEasternTime(event.endTime) : null,
				// Raw ISO UTC string for reliable JS Date parsing/sorting/filtering
				startTimeRaw: event.startTime,
				endTimeRaw: event.endTime ?? null,
			}));
		} catch (error) {
			throw new TRPCError({
				code: 'INTERNAL_SERVER_ERROR',
				message: error instanceof Error ? error.message : 'Failed to fetch events',
			});
		}
	}),

	getById: publicProcedure
		.input(z.object({ id: z.string().uuid() }))
		.query(async ({ input }) => {
			const [event] = await db
				.select()
				.from(Events)
				.where(eq(Events.id, input.id))
				.limit(1);

			if (!event) {
				throw new TRPCError({ code: 'NOT_FOUND', message: 'Event not found' });
			}

			return {
				...event,
				startTime: toEasternTime(event.startTime),
				endTime: event.endTime ? toEasternTime(event.endTime) : null,
				startTimeRaw: event.startTime,
				endTimeRaw: event.endTime ?? null,
			};
		}),

	getBySlug: publicProcedure
		.input(z.object({ slug: z.string() }))
		.query(async ({ input }) => {
			const [event] = await db
				.select()
				.from(Events)
				.where(eq(Events.slug, input.slug))
				.limit(1);

			if (!event) {
				throw new TRPCError({ code: 'NOT_FOUND', message: 'Event not found' });
			}

			return {
				...event,
				startTime: toEasternTime(event.startTime),
				endTime: event.endTime ? toEasternTime(event.endTime) : null,
				startTimeRaw: event.startTime,
				endTimeRaw: event.endTime ?? null,
			};
		}),

	create: adminProcedure
		.input(eventCreateSchema)
		.mutation(async ({ input }) => {
			try {
				const newEvent = await db
					.insert(Events)
					.values({
						title: input.title,
						description: input.description,
						location: input.location,
						startTime: new Date(input.startTime).toISOString(),
						endTime: input.endTime ? new Date(input.endTime).toISOString() : null,
						committeeId: input.committeeId ?? null,
						flyerUrl: input.flyerUrl ?? null,
						rsvpLink: input.rsvpLink ?? null,
						slug: input.slug ?? null,
						requiresDues: input.requiresDues ?? false,
					})
					.returning();

				return { success: true, event: newEvent[0] };
			} catch (error) {
				throw new TRPCError({
					code: 'INTERNAL_SERVER_ERROR',
					message: error instanceof Error ? error.message : 'Failed to create event',
				});
			}
		}),

	update: adminProcedure
		.input(z.object({ id: z.string().uuid(), data: eventUpdateSchema }))
		.mutation(async ({ input }) => {
			const [updated] = await db
				.update(Events)
				.set({ ...input.data, updatedAt: new Date().toISOString() })
				.where(eq(Events.id, input.id))
				.returning();

			if (!updated) {
				throw new TRPCError({ code: 'NOT_FOUND', message: 'Event not found' });
			}

			return { success: true, event: updated };
		}),

	delete: adminProcedure
		.input(z.object({ id: z.string().uuid() }))
		.mutation(async ({ input }) => {
			const [deleted] = await db
				.delete(Events)
				.where(eq(Events.id, input.id))
				.returning();

			if (!deleted) {
				throw new TRPCError({ code: 'NOT_FOUND', message: 'Event not found' });
			}

			return { success: true };
		}),

	/**
	 * Add an attendee to an event via QR code scan.
	 * Requires officer or admin privileges (scanner is officer-facing).
	 * Validates: event active, member active, no duplicate, dues if required.
	 */
	addAttendee: officerProcedure
		.input(
			z.object({
				eventId: z.string().uuid(),
				discordId: z.string().min(1),
			}),
		)
		.mutation(async ({ input }) => {
			// 1. Verify event exists and is active
			const [event] = await db
				.select()
				.from(Events)
				.where(eq(Events.id, input.eventId))
				.limit(1);

			if (!event) {
				throw new TRPCError({ code: 'NOT_FOUND', message: 'Event not found' });
			}
			if (!event.active) {
				throw new TRPCError({ code: 'FORBIDDEN', message: 'Event is not active' });
			}

			// 2. Verify member exists and is active
			const [member] = await db
				.select()
				.from(Members)
				.where(eq(Members.discordID, input.discordId))
				.limit(1);

			if (!member) {
				throw new TRPCError({ code: 'NOT_FOUND', message: 'Member not found' });
			}
			if (!member.active) {
				throw new TRPCError({ code: 'FORBIDDEN', message: 'Member is not active' });
			}

			// 3. Check for duplicate attendance
			const [existing] = await db
				.select()
				.from(EventAttendees)
				.where(
					and(
						eq(EventAttendees.eventId, input.eventId),
						eq(EventAttendees.memberId, member.id),
					),
				)
				.limit(1);

			if (existing) {
				throw new TRPCError({ code: 'CONFLICT', message: 'Member already checked in' });
			}

			// 4. Check dues if required
			if (event.requiresDues && !member.duesPaid) {
				throw new TRPCError({
					code: 'FORBIDDEN',
					message: 'Dues payment required for this event',
				});
			}

			const [newAttendee] = await db
				.insert(EventAttendees)
				.values({ eventId: input.eventId, memberId: member.id })
				.returning();

			return { success: true, attendee: newAttendee };
		}),
});