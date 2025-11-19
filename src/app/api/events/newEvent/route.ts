/**
 * @fileoverview API route for creating a new event.
 * 
 * This endpoint handles POST requests to create a new event in the database.
 * It validates that all required fields are present in the request body before insertion.
 * 
 * Endpoint: `/api/events/newEvent`
 * Method: `POST`
 * 
 * Request Body:
 * - `title`: string (required) - The title of the event.
 * - `location`: string (required) - The location where the event will take place.
 * - `description`: string (required) - A description of the event.
 * - `startTime`: string (required) - The start date and time of the event in ISO format.
 * - `endTime`: string (optional) - The end date and time of the event in ISO format.
 * - `committeeId`: string (UUID, optional) - The ID of the host committee.
 * - `requiresDues`: boolean (optional, defaults to false)
 * 
 * Functionality:
 * 1. Validates that `title`, `location`, `description`, and `startTime` are provided.
 * 2. Parses and converts `startTime` and `endTime` to ISO string format.
 * 3. Inserts the new event data into the `Events` table.
 * 
 * Success Response:
 * - `200 OK`: `{ success: true, data: newEvent }` - Returns the newly created event object.
 * 
 * Error Responses:
 * - `400 Bad Request`: `{ success: false, error: 'Missing required fields' }`
 *   - Occurs if any of the required fields are missing from the request body.
 * - `500 Internal Server Error`: `{ success: false, error: 'Failed to create event' }`
 *   - Generic error for unexpected server-side issues, including database errors.
 */
import { db } from '@/lib/database/client';
import { Events } from '@/lib/database/schema';
import { NextResponse } from 'next/server';

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


// Old Mongo collection
// import { dbConnect } from '@/lib/mongodb';
// import { db } from '@/lib/database/drizzle';
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