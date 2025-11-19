/**
 * @fileoverview Main API route for handling event-related operations.
 * 
 * This file defines the handlers for GET and POST requests to the `/api/events` endpoint.
 * - GET: Fetches all active events, sorted by start time.
 * - POST: Creates a new event with validated data.
 */

import { db } from '@/lib/database/client';
import { Events } from '@/lib/database/schema';
import { NextResponse } from 'next/server';
import { asc, eq } from 'drizzle-orm';

/**
 * @description Handles GET requests to fetch all active events.
 * 
 * Fetches all events from the database where the `active` flag is true.
 * The results are sorted by `startTime` in ascending order.
 * 
 * @method GET
 * @returns {NextResponse} A JSON response containing the list of events or an error.
 * 
 * Success Response:
 * - `200 OK`: `{ success: true, data: events }`
 * 
 * Error Responses:
 * - `500 Internal Server Error`: `{ success: false, error: 'Failed to fetch events' }`
 */
export async function GET() {
	try {
		const events = await db.select().from(Events).where(eq(Events.active, true)).orderBy(asc(Events.startTime));
		return NextResponse.json({ success: true, data: events });
	} catch (error) {
		console.error(error);
		return NextResponse.json({ success: false, error: 'Failed to fetch events' }, { status: 500 });
	}
}

/**
 * @description Handles POST requests to create a new event.
 * 
 * Creates a new event record in the database. It validates that all required fields 
 * (`title`, `location`, `description`, `startTime`) are present in the request body.
 * 
 * @method POST
 * @param {Request} request The incoming HTTP request.
 * @returns {NextResponse} A JSON response containing the newly created event or an error.
 * 
 * Request Body:
 * - `title`: string (required)
 * - `location`: string (required)
 * - `description`: string (required)
 * - `startTime`: string (required, ISO format)
 * 
 * Success Response:
 * - `200 OK`: `{ success: true, data: newEvent }`
 * 
 * Error Responses:
 * - `400 Bad Request`: `{ success: false, error: 'Missing required fields' }`
 * - `500 Internal Server Error`: `{ success: false, error: 'Failed to create event' }`
 */
export async function POST(request: Request) {
	try {
		const body = await request.json();
		const { title, location, description, startTime, endTime, committeeId, ...rest } = body;

		// Validate required fields
		if (!title || !location || !description || !startTime) {
			return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
		}

		const values = {
			...rest,
			title,
			location,
			description,
			committeeId: committeeId || null,
			startTime: new Date(startTime).toISOString(),
			endTime: endTime ? new Date(endTime).toISOString() : null,
		};

		const newEvent = await db.insert(Events).values(values).returning();
		return NextResponse.json({ success: true, data: newEvent });
	} catch (error) {
		console.error(error);
		return NextResponse.json({ success: false, error: 'Failed to create event' }, { status: 500 });
	}
}

// Old Mongo
// import { MongoClient } from "mongodb";
// import { DateTime } from "luxon";
// const uri = process.env.MONGODB_URI!;
// const client = new MongoClient(uri);
// const dbName = "IEEE-Website";
// export async function GET() {
//   await dbConnect();
//   await client.connect();
//   const db = client.db(dbName);
//   try {
//     const events = await db.collection('Events').find({}).toArray();
//     const convertedEvents = events.map(event => {
//       let utcTime;
//       if (typeof event.time === "string") {
//         utcTime = DateTime.fromISO(event.time, { zone: 'utc' });
//       } else {
//         utcTime = DateTime.fromJSDate(event.time, { zone: 'utc' });
//       }
//       const easternTime = utcTime.setZone('America/New_York').toFormat('MMMM d, yyyy h:mm a');
//       return {
//         ...event,
//         time: easternTime,
//       };
//     });
//     return NextResponse.json({ success: true, data: convertedEvents });
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json({ success: false, error: 'Failed to fetch events' }, { status: 500 });
//
// }