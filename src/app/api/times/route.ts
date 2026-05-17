import { db } from '@/lib/database/client';
import { MeetingTimes } from '@/lib/database/schema';
import { NextResponse } from 'next/server';
import { asc, eq } from 'drizzle-orm';

export async function GET() {
	try {
		const times = await db
			.select()
			.from(MeetingTimes)
			.where(eq(MeetingTimes.active, true))
			.orderBy(asc(MeetingTimes.dayOfWeek), asc(MeetingTimes.startTime));
		return NextResponse.json({ success: true, data: times });
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ success: false, error: 'Failed to fetch meeting times' },
			{ status: 500 },
		);
	}
}
