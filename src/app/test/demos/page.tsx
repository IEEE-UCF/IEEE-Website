import { Navbar } from '@/components/navbar';
import { FormPopup } from '@/components/dashboard/newEventForm';
import { EventList } from '@/components/dashboard/event-list';
import { AddAttendeeButton } from '@/components/demos/AddAttendeeButton';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { db } from '@/lib/database/client';
import { Members } from '@/lib/database/schema';
import { eq } from 'drizzle-orm';

export default async function Dashboard() {
	const session = await getServerSession(authOptions);
	if (!session) redirect('/auth/signin');

	const [member] = await db
		.select({ officerStatus: Members.officerStatus, administrator: Members.administrator })
		.from(Members)
		.where(eq(Members.userId, session.user.id))
		.limit(1);

	const hasAccess = member?.officerStatus || member?.administrator;

	return (
		<div className="flex flex-col max-w-screen overflow-hidden bg-black min-h-screen">
			<div className="relative w-full">
				<div className="absolute z-4 w-fit h-fit inset-0 px-5">
					<Navbar />
				</div>
			</div>
			<div className="flex flex-col items-center justify-center h-screen">
				{hasAccess ? (
					<>
						<AddAttendeeButton />
						<FormPopup />
					</>
				) : (
					<p className="text-white text-lg">Officer or admin access required to use these features.</p>
				)}
				<EventList />
			</div>
		</div>
	);
}
