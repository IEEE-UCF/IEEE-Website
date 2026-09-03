import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { and, eq } from 'drizzle-orm';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/database/client';
import { Members, MemberPermissions } from '@/lib/database/schema';
import { STAFF_CAPABILITY_KEYS } from '@/lib/permissions';
import { Navbar } from '@/components/navbar';
import { StaffHub } from '@/components/staff/staff-hub';

// /staff — reachable by admins, officers, or anyone with a granted capability.
// src/middleware.ts is the fast gate; this is the authoritative backstop so an
// unauthorised hit never silently renders (or lands on the marketing home).
export default async function StaffPage() {
	const session = await getServerSession(authOptions);
	if (!session?.user?.id) redirect('/auth/signin?callbackUrl=/staff');

	const [member] = await db
		.select({ id: Members.id, administrator: Members.administrator, officerStatus: Members.officerStatus })
		.from(Members)
		.where(eq(Members.userId, session.user.id))
		.limit(1);

	let hasStaffGrant = false;
	if (member) {
		const grants = await db
			.select({ permission: MemberPermissions.permission })
			.from(MemberPermissions)
			.where(and(eq(MemberPermissions.memberId, member.id), eq(MemberPermissions.active, true)));
		hasStaffGrant = grants.some((g) =>
			(STAFF_CAPABILITY_KEYS as string[]).includes(g.permission),
		);
	}

	if (!member?.administrator && !member?.officerStatus && !hasStaffGrant) {
		redirect('/dashboard');
	}

	return (
		<div className="flex min-h-screen flex-col bg-black">
			<div className="w-full px-5">
				<Navbar />
			</div>
			<main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
				<h1 className="mb-6 text-3xl font-[heading-font] text-[var(--ieee-dark-yellow)]">STAFF</h1>
				<StaffHub />
			</main>
		</div>
	);
}
