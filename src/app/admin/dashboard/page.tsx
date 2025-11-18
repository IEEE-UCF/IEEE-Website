import { Navbar } from "@/components/navbar";
import { FormPopup } from "@/components/dashboard/newEventForm";
import { EventList } from "@/components/dashboard/event-list";
import { QREventScanner } from "@/components/admin/qr_event_scanner";

export default function Dashboard() {
    return (
        <div className="flex flex-col max-w-screen overflow-hidden bg-black min-h-screen text-white">
            <div className="relative w-full">
                <div className="absolute z-10 w-full px-5">
                    <Navbar />
                </div>
            </div>
            <div className="flex flex-grow pt-20 justify-center">
                <div className="flex w-full max-w-screen-xl">
                    {/* Main Content */}
                    <main className="w-2/3 p-6">
                        <div className="flex justify-center">
                            <QREventScanner />
                        </div>
                    </main>

                    {/* Sidebar */}
                    <aside className="w-1/3 max-w-md p-6 bg-gray-800 rounded-l-lg">
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-xl font-semibold mb-4">Create New Event</h2>
                                <FormPopup />
                            </div>
                            <div className="border-t border-gray-700 pt-6">
                                <h2 className="text-xl font-semibold mb-4">Upcoming Events</h2>
                                <EventList />
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
};
