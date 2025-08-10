import { dbConnect } from '@/lib/mongodb';
import { NextResponse } from 'next/server';
import { MongoClient } from "mongodb";
import { DateTime } from "luxon";

const uri = process.env.MONGODB_URI!;
const client = new MongoClient(uri);
const dbName = "IEEE-Website"; 

export async function GET() {
  await dbConnect();

  await client.connect();
  const db = client.db(dbName);

  try {
    const events = await db.collection('Events').find({}).toArray();
    const convertedEvents = events.map(event => {
      let utcTime;
      if (typeof event.time === "string") {
        utcTime = DateTime.fromISO(event.time, { zone: 'utc' });
      } else {
        utcTime = DateTime.fromJSDate(event.time, { zone: 'utc' });
      }
      const easternTime = utcTime.setZone('America/New_York').toFormat('MMMM d, yyyy h:mm a');

      return {
        ...event,
        time: easternTime, 
      };
    });

    return NextResponse.json({ success: true, data: convertedEvents });
  
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: 'Failed to fetch events' }, { status: 500 });
  }

}