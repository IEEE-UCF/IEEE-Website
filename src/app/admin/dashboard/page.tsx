import { Navbar } from '@/components/navbar';
import { FormPopup } from '@/components/dashboard/newEventForm';
import { EventList } from '@/components/dashboard/event-list';
import { Card } from '@/components/ui/card';
import { QREventScanner } from '@/components/admin/qr_event_scanner';

export default function Dashboard() {
	return (
		<div className="flex min-h-screen max-w-screen flex-col overflow-hidden bg-ieee-black text-white">
			{/* Navbar – match home spacing */}
			<div className="w-full px-5">
				<Navbar />
			</div>

			{/* Dashboard Content */}
			<main className="flex-1">
				<div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6 lg:flex-row">
					{/* Left Panel – QR Scanner */}
					<Card className="flex-1 rounded-xl bg-ieee-near-black p-4 shadow-lg shadow-black/40 lg:p-6">
						<h2 className="mb-4 text-lg font-heading text-white lg:text-xl">
							Event Check-In
						</h2>
						<div className="flex justify-center">
							<QREventScanner />
						</div>
					</Card>

					{/* Right Panel – Event Management */}
					<Card className="flex-1 rounded-xl bg-ieee-near-black p-4 shadow-lg shadow-black/40 lg:max-w-md lg:p-6">
						<div className="space-y-6">
							<div>
								<h2 className="mb-3 text-lg font-heading text-white lg:text-xl">
									Create New Event
								</h2>
								<FormPopup />
							</div>
							<div className="border-t border-ieee-dark-grey pt-5">
								<h2 className="mb-3 text-lg font-heading text-white lg:text-xl">
									Upcoming Events
								</h2>
								<EventList />
							</div>
						</div>
					</Card>
				</div>
			</main>
		</div>
	);
}
