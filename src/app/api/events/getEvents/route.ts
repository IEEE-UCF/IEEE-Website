/**
 * @fileoverview API route for fetching all active events.
 *
 * This endpoint handles GET requests to retrieve a list of all events that are currently marked as active.
 * The events are sorted by their start time in ascending order, making it suitable for displaying
 * upcoming event schedules.
 *
 * Endpoint: `/api/events/getEvents`
 * Method: `GET`
 *
 * Success Response:
 * - `200 OK`: `{ success: true, data: events }`
 *   - `events`: An array of event objects from the database.
 *
 * Error Responses:
 * - `500 Internal Server Error`: `{ success: false, error: 'Failed to fetch events' }`
 *   - Occurs if there is a problem querying the database.
 */
import { db } from '@/lib/database/client';
import { Events } from '@/lib/database/schema';
import { NextResponse } from 'next/server';
import { asc, eq } from 'drizzle-orm';

export async function GET() {
	try {
		const events = await db
			.select()
			.from(Events)
			.where(eq(Events.active, true))
			.orderBy(asc(Events.startTime));
		return NextResponse.json({ success: true, data: events });
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ success: false, error: 'Failed to fetch events' },
			{ status: 500 },
		);
	}
}
