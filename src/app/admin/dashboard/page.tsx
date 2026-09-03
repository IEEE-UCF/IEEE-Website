import Link from 'next/link';
import { Navbar } from '@/components/navbar';
import { FormPopup } from '@/components/dashboard/newEventForm';
import { EventList } from '@/components/dashboard/event-list';
import { Card, CardHeader } from '@/components/ui/card';
import { QREventScanner } from '@/components/admin/qr_event_scanner';

const ADMIN_TOOLS = [
	{ href: '/admin/members', title: 'Members', desc: 'Grant admin / officer status & roles' },
	{ href: '/admin/photos', title: 'Event Photos', desc: 'Upload & manage photos per event' },
	{ href: '/admin/resumes', title: 'Résumés', desc: 'Browse member résumés' },
];

export default function Dashboard() {
	return (
		<div className="flex flex-col max-w-screen overflow-hidden bg-black min-h-screen text-black">
			{/* Navbar – match home spacing */}
			<div className="w-full px-5">
				<Navbar />
			</div>

			{/* Dashboard Content */}
			<main className="flex-1">
				<div className="mx-auto max-w-6xl px-4 pt-6">
					<h2 className="mb-3 text-lg font-semibold text-gray-100 lg:text-xl">Admin Tools</h2>
					<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
						{ADMIN_TOOLS.map((tool) => (
							<Link
								key={tool.href}
								href={tool.href}
								className="rounded-xl border border-gray-800 bg-gray-900/60 p-4 shadow-lg shadow-black/40 transition-colors hover:border-[var(--ieee-dark-yellow)] hover:bg-gray-900"
							>
								<div className="text-base font-semibold text-gray-100">{tool.title}</div>
								<div className="mt-1 text-sm text-gray-400">{tool.desc}</div>
							</Link>
						))}
					</div>
				</div>

				<div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6 lg:flex-row">
					{/* Left Panel – QR Scanner */}
					<section className="flex-1 rounded-xl border border-gray-800 bg-gray-900/60 p-4 shadow-lg shadow-black/40 lg:p-6">
						<h2 className="mb-4 text-lg font-semibold text-gray-100 lg:text-xl">
							Event Check-In
						</h2>
						<div className="flex justify-center">
							<QREventScanner />
						</div>
					</section>

					<Card>
						<CardHeader></CardHeader>
						Event Check-In
					</Card>

					{/* Right Panel – Event Management */}
					<section className="flex-1 rounded-xl border border-gray-800 bg-gray-900/60 p-4 shadow-lg shadow-black/40 lg:max-w-md lg:p-6">
						<div className="space-y-6">
							<div>
								<h2 className="mb-3 text-lg font-semibold text-gray-100 lg:text-xl">
									Create New Event
								</h2>
								<FormPopup />
							</div>
							<div className="border-t border-gray-800 pt-5">
								<h2 className="mb-3 text-lg font-semibold text-gray-100 lg:text-xl">
									Upcoming Events
								</h2>
								<EventList />
							</div>
						</div>
					</section>
				</div>
			</main>
		</div>
	);
}
