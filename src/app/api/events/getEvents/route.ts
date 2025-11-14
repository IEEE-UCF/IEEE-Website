// Dawn Balaschak 11/14/2025
// API get to grab all events from database, no filters/types TODO

import { db } from '@/lib/database/drizzle';
import { Events } from '@/lib/database/schema';
import { NextResponse } from 'next/server';



export async function GET() {
  try {
    const events = await db.select().from(Events);
    return NextResponse.json({ success: true, data: events });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: 'Failed to fetch events' }, { status: 500 });
  }
}