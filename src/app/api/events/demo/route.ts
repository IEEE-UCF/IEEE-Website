
import { NextResponse } from 'next/server';
import { db } from '@/lib/database/drizzle';
import { Events } from '@/lib/database/schema';
import { sql } from 'drizzle-orm';

export async function POST(request: Request) {
    try {
        // Sample data for a new event
        const demoEventData = {
            title: 'Demo Event - Test Insertion',
            location: 'Virtual / Online',
            committeeId: null, // Using null as we don't have a valid committee ID for a demo
            description: 'This is a test event created via the /api/events/demo route for database insertion testing.',
            flyerUrl: null, // No flyer URL for this demo event
            rsvpLink: null, // No RSVP link for this demo event
            photoUrls: JSON.stringify(["/path/to/demo/photo1.jpg", "/path/to/demo/photo2.png"]), // Example photo URLs as a JSON string
            startTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from now
            endTime: new Date(Date.now() + 25 * 60 * 60 * 1000).toISOString(), // 25 hours from now
            requiresDues: false,
            slug: 'demo-event-test', // A unique slug for this demo event
            // 'id', 'createdAt', 'updatedAt', 'active' will be handled by Drizzle ORM defaults
        };
        console.log(demoEventData);

        // Insert the demo event into the database
        const newEvent = await db.insert(Events).values(demoEventData).returning();

        // Return a success response
        return NextResponse.json({ success: true, message: 'Demo event created successfully', data: newEvent });

    } catch (error) {
        console.error('Error creating demo event:', error);
        // Return an error response
        return NextResponse.json({ success: false, error: 'Failed to create demo event' }, { status: 500 });
    }
}
