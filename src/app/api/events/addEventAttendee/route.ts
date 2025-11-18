import { db } from '@/lib/database/client';
import { EventAttendees} from '@/lib/database/schema';
import { Members } from '@/lib/database/schema';
import { NextResponse } from 'next/server';
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
	try {
		const body = await request.json();
		const { eventId, discordId } = body;

		if (!eventId || !discordId) {
			return NextResponse.json({ success: false, error: 'eventId and memberId are required' }, { status: 400 });
		}

		// discordID -> member -> memberID  -> used for adding attendances.
		const [member] = await db.select().from(Members).where(eq(Members.discordID, discordId)).limit(1);
		// console.log("memberD is:");
		// console.log(member);
		// console.log(member.userId);
		if(member)
		{
			// console.log("member is:");
			// console.log(member);
			const values = {
				eventId: eventId,
				memberId: member.id,
			};
			// console.log("adding with the following values");
			// console.log(values);

			const newAttendee = await db.insert(EventAttendees).values(values).returning();
			return NextResponse.json({ success: true, data: newAttendee });
		}
		return NextResponse.json({ success: false, error: 'Failed to add event attendee: no member with user found' }, { status: 500 });
		
	} catch (error) {
		console.error(error);
		return NextResponse.json({ success: false, error: 'Failed to add event attendee' }, { status: 500 });
	}
}
