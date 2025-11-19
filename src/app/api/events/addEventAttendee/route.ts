/**
 * @fileoverview API route for adding an attendee to an event.
 * 
 * This endpoint handles POST requests to check in a member to a specific event.
 * It performs comprehensive validation and checks to ensure data integrity and proper business logic.
 * 
 * Endpoint: `/api/events/addEventAttendee`
 * Method: `POST`
 * 
 * Request Body:
 * - `eventId`: string (UUID) - The unique identifier of the event.
 * - `discordId`: string - The Discord ID of the member to be checked in.
 * 
 * Functionality:
 * 1. Validates that both `eventId` and `discordId` are provided in the request body.
 * 2. Fetches the event from the database, ensuring it exists and is currently active.
 * 3. Fetches the member from the database using their `discordId`, ensuring they exist and are active.
 * 4. Checks if the member has already been checked into the specified event to prevent duplicate attendance.
 * 5. If the event requires dues, it verifies that the member has paid their dues.
 * 6. If all checks pass, a new attendee record is created in the `EventAttendees` table.
 * 
 * Success Response:
 * - `200 OK`: `{ success: true, data: newAttendee }` - Returns the newly created attendee record.
 * 
 * Error Responses:
 * - `400 Bad Request`: `{ success: false, error: 'eventId and discordId are required' }`
 *   - Occurs if `eventId` or `discordId` are missing from the request body.
 * - `404 Not Found`: `{ success: false, error: 'Event not found' }`
 *   - Occurs if no event with the given `eventId` exists.
 * - `404 Not Found`: `{ success: false, error: 'Member not found' }`
 *   - Occurs if no member with the given `discordId` exists.
 * - `403 Forbidden`: `{ success: false, error: 'Event is not active' }`
 *   - Occurs if the found event is marked as inactive.
 * - `403 Forbidden`: `{ success: false, error: 'Member is not active' }`
 *   - Occurs if the found member is marked as inactive.
 * - `409 Conflict`: `{ success: false, error: 'Member already checked in' }`
 *   - Occurs if a record already exists for the member at the event.
 * - `402 Payment Required`: `{ success: false, error: 'Dues payment required for this event' }`
 *   - Occurs if the event requires dues and the member has not paid.
 * - `500 Internal Server Error`: `{ success: false, error: 'Failed to add event attendee' }`
 *   - Generic error for unexpected server-side issues.
 */

import { db } from '@/lib/database/client';
import { EventAttendees, Events, Members } from '@/lib/database/schema';
import { NextResponse } from 'next/server';
import { and, eq } from "drizzle-orm";

export async function POST(request: Request) {
	try {
		const body = await request.json();
		const { eventId, discordId } = body;

		if (!eventId || !discordId) {
			return NextResponse.json({ success: false, error: 'eventId and discordId are required' }, { status: 400 });
		}

		// 1. Check if event exists and is active
		const [event] = await db.select().from(Events).where(eq(Events.id, eventId)).limit(1);
		if (!event) {
			return NextResponse.json({ success: false, error: 'Event not found' }, { status: 404 });
		}
		if (!event.active) {
			return NextResponse.json({ success: false, error: 'Event is not active' }, { status: 403 });
		}

		// 2. Check if member exists and is active
		const [member] = await db.select().from(Members).where(eq(Members.discordID, discordId)).limit(1);
		if (!member) {
			return NextResponse.json({ success: false, error: 'Member not found' }, { status: 404 });
		}
		if (!member.active) {
			return NextResponse.json({ success: false, error: 'Member is not active' }, { status: 403 });
		}

		// 3. Check for duplicate attendance
		const [existingAttendee] = await db.select().from(EventAttendees).where(and(eq(EventAttendees.eventId, eventId), eq(EventAttendees.memberId, member.id))).limit(1);
		if (existingAttendee) {
			return NextResponse.json({ success: false, error: 'Member already checked in' }, { status: 409 });
		}

		// 4. Check if event requires dues and if member has paid
		if (event.requiresDues && !member.duesPaid) {
			return NextResponse.json({ success: false, error: 'Dues payment required for this event' }, { status: 402 });
		}
		
		const values = {
			eventId: eventId,
			memberId: member.id,
		};

		const newAttendee = await db.insert(EventAttendees).values(values).returning();
		return NextResponse.json({ success: true, data: newAttendee });
		
	} catch (error: any) {
		console.error(error);
		// Handle potential database errors, like unique constraint violations
		if (error.code === '23505') { 
			return NextResponse.json({ success: false, error: 'Member already checked in' }, { status: 409 });
		}
		return NextResponse.json({ success: false, error: 'Failed to add event attendee' }, { status: 500 });
	}
}
