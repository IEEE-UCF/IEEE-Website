import { Navbar } from '@/components/navbar';
import { MembersManager } from '@/components/admin/members-manager';

// /admin/members — admins and officers (src/middleware.ts officerAdminRoutes).
// Admins manage all roles/capabilities; officers see the roster and can toggle only
// the capabilities an admin has delegated, for regular members.
export default function AdminMembersPage() {
	return (
		<div className="flex min-h-screen flex-col bg-black">
			<div className="w-full px-5">
				<Navbar />
			</div>
			<main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8">
				<h1 className="mb-2 text-3xl font-[heading-font] text-[var(--ieee-dark-yellow)]">MEMBERS</h1>
				<p className="mb-6 text-sm text-gray-400">
					View the member roster with role, capability, résumé, and committee status. Admins can
					grant or revoke <strong>administrator</strong> / <strong>officer</strong> status and any
					capability; officers can toggle admin-delegated capabilities for regular members.
				</p>
				<MembersManager />
			</main>
		</div>
	);
}
