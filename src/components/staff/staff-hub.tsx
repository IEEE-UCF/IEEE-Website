'use client';

import Link from 'next/link';
import { trpc } from '@/lib/trpc/client';
import { hasCapability, CAPABILITIES, type Capability } from '@/lib/permissions';
import { FormPopup } from '@/components/dashboard/newEventForm';
import { QREventScanner } from '@/components/admin/qr_event_scanner';

function CapTag({ cap }: { cap: Capability }) {
	return (
		<span className="rounded bg-gray-800 px-2 py-0.5 font-mono text-[10px] tracking-tight text-gray-400">
			{cap}
		</span>
	);
}

function Panel({
	title,
	cap,
	wide,
	children,
}: {
	title: string;
	cap?: Capability;
	wide?: boolean;
	children: React.ReactNode;
}) {
	return (
		<section
			className={`flex flex-col rounded-xl border border-gray-800 bg-gray-900/60 p-4 shadow-lg shadow-black/40 ${
				wide ? 'lg:col-span-2' : ''
			}`}
		>
			<div className="mb-3 flex items-center gap-2">
				<h2 className="text-sm font-[heading-font] tracking-[0.14em] text-gray-100 uppercase">
					{title}
				</h2>
				{cap && (
					<span className="ml-auto flex items-center gap-2">
						<span className="text-[11px] text-gray-500">{CAPABILITIES[cap].label}</span>
						<CapTag cap={cap} />
					</span>
				)}
			</div>
			{children}
		</section>
	);
}

function LinkCard({ href, label }: { href: string; label: string }) {
	return (
		<Link
			href={href}
			className="inline-flex items-center gap-1 rounded-md border border-gray-700 px-3 py-2 text-sm text-gray-200 transition-colors hover:border-[var(--ieee-dark-yellow)] hover:text-[var(--ieee-dark-yellow)]"
		>
			{label} <span aria-hidden className="opacity-60">→</span>
		</Link>
	);
}

export function StaffHub() {
	const { data: auth, isLoading } = trpc.auth.getAuthStatus.useQuery();

	if (isLoading) {
		return <p className="text-sm text-gray-400">Loading…</p>;
	}

	const subject = {
		administrator: auth?.isAdmin,
		officerStatus: auth?.isOfficer,
		permissions: auth?.permissions ?? [],
	};
	const can = (c: Capability) => hasCapability(subject, c);
	const isAdmin = Boolean(auth?.isAdmin);

	const scope = isAdmin
		? 'Administrator — full access'
		: auth?.isOfficer
			? `Officer${auth.officerRole ? ` · ${auth.officerRole}` : ''}`
			: `Helper · ${(auth?.permissions ?? []).join(', ') || 'no grants'}`;

	const anyTool =
		can('manage_events') || can('scan_attendance') || can('manage_event_photos') || can('review_resumes');

	return (
		<div className="text-gray-100">
			<div className="mb-6 flex flex-wrap items-baseline gap-x-4 gap-y-1">
				<span className="text-sm text-gray-500">
					{auth?.member ? `${auth.member.firstName} ${auth.member.lastName}` : 'Signed in'}
				</span>
				<span className="rounded-full border border-gray-700 px-3 py-1 text-xs text-gray-300">
					{scope}
				</span>
			</div>

			{!anyTool && !isAdmin && (
				<p className="rounded-lg border border-gray-800 bg-gray-900/60 p-4 text-sm text-gray-400">
					You don&apos;t have any staff tools yet. An admin can grant you capabilities on the
					Members screen.
				</p>
			)}

			<div className="grid gap-4 lg:grid-cols-2">
				{can('scan_attendance') && (
					<Panel title="Check-in" cap="scan_attendance" wide>
						<QREventScanner />
					</Panel>
				)}

				{can('manage_events') && (
					<Panel title="Events" cap="manage_events">
						<p className="mb-3 text-sm text-gray-400">Create a new event.</p>
						<FormPopup />
						{isAdmin && (
							<div className="mt-3">
								<LinkCard href="/admin/dashboard" label="Full event management" />
							</div>
						)}
					</Panel>
				)}

				{can('manage_event_photos') && (
					<Panel title="Event Photos" cap="manage_event_photos">
						<p className="mb-3 text-sm text-gray-400">
							Upload and manage photos per event, set captions, tags, and visibility.
						</p>
						<LinkCard href="/admin/photos" label="Open photo manager" />
					</Panel>
				)}

				{can('review_resumes') && (
					<Panel title="Résumés" cap="review_resumes">
						<p className="mb-3 text-sm text-gray-400">
							Browse member résumés with inline preview and filters.
						</p>
						<LinkCard href="/admin/resumes" label="Open résumé review" />
					</Panel>
				)}

				{(isAdmin || auth?.isOfficer) && (
					<Panel title="Members">
						<p className="mb-3 text-sm text-gray-400">
							{isAdmin
								? 'Roster, roles, capabilities, and résumé / committee status.'
								: 'Roster & status. Toggle admin-delegated capabilities for regular members.'}
						</p>
						<LinkCard href="/admin/members" label="Open members" />
					</Panel>
				)}

				{isAdmin && (
					<Panel title="Admin">
						<p className="mb-3 text-sm text-gray-400">
							The full admin dashboard — events, photos, résumés, and site settings.
						</p>
						<LinkCard href="/admin/dashboard" label="Admin dashboard" />
					</Panel>
				)}
			</div>
		</div>
	);
}
