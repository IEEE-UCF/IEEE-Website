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
// import { dbConnect } from '@/lib/mongodb';
//import { db } from '@/lib/database/drizzle';
import { db } from '@/lib/database/client';
import { Events } from '@/lib/database/schema';
import { NextResponse } from 'next/server';
import { asc, eq } from "drizzle-orm";
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

export async function GET() {
	try {
		const events = await db.select().from(Events).where(eq(Events.active, true)).orderBy(asc(Events.startTime));
		return NextResponse.json({ success: true, data: events });
	} catch (error) {
		console.error(error);
		return NextResponse.json({ success: false, error: 'Failed to fetch events' }, { status: 500 });
	}
}
