import { Navbar } from "@/components/navbar";
import { FormPopup } from "@/components/dashboard/newEventForm";
import { EventList } from "@/components/dashboard/event-list";
import { AddAttendeeButton } from "@/components/demos/AddAttendeeButton";

export default function Dashboard() {
	return (
		<div className="flex flex-col max-w-screen overflow-hidden bg-black min-h-screen">
			<div className="relative w-full">
				<div className="absolute z-4 w-fit h-fit inset-0 px-5">
					<Navbar />
				</div>
			</div>
			<div className="flex flex-col items-center justify-center h-screen">
				<AddAttendeeButton />
				<FormPopup />
				<EventList />
			</div>
		</div>
	);
};
