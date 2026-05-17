import { db } from '@/lib/database/client';
import { Awards } from '@/lib/database/schema';
import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';

export async function GET() {
	try {
		const awards = await db
			.select()
			.from(Awards)
			.where(eq(Awards.active, true));
		return NextResponse.json({ success: true, data: awards });
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ success: false, error: 'Failed to fetch awards' },
			{ status: 500 },
		);
	}
}
