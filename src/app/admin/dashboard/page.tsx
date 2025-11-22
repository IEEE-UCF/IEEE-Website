import { Navbar } from "@/components/navbar";
import { FormPopup } from "@/components/dashboard/newEventForm";
import { EventList } from "@/components/dashboard/event-list";
import { QREventScanner } from "@/components/admin/qr_event_scanner";

export default function Dashboard() {
	return (
		<div className="flex flex-col max-w-screen overflow-hidden bg-black min-h-screen text-black">
			{/* Navbar – match home spacing */}
			<div className="w-full px-5">
				<Navbar />
			</div>

			{/* Dashboard Content */}
			<main className="flex-1">
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
};
