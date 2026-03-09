'use client';

import { useState, useEffect } from 'react';
import { MapPin, CalendarIcon as Calendar1, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { trpc } from '@/lib/trpc/client';

interface Event {
	eventName: string;
	eventDate: string;
	eventDesc: string;
	eventAddress: string;
	eventFlyer: string | null;
	_sortDate: number;
}

export default function EventSidebar() {
	const monthNames = [
		'January', 'February', 'March', 'April', 'May', 'June',
		'July', 'August', 'September', 'October', 'November', 'December',
	];
	const currentMonthName = monthNames[new Date().getMonth()];
	const [currentMonth] = useState(currentMonthName);
	const [currentEvent, setCurrentEvent] = useState<Event | null>(null);
	const [showEventOnMobile, setShowEventOnMobile] = useState(false);

	const now = new Date();

	// trpc.event.getAll already returns Eastern-formatted strings and active-only events
	const { data: rawEvents = [] } = trpc.event.getAll.useQuery();

	// Map and filter to future events only
	const eventData: Event[] = rawEvents
		.filter((e) => {
			// Use startTimeRaw (ISO UTC) for reliable Date parsing — never parse the
			// Eastern-formatted display string ("March 9, 2026 7:30 PM") with new Date()
			// because that format is not reliably parseable across browsers.
			const parsed = new Date(e.startTimeRaw);
			return !isNaN(parsed.getTime()) ? parsed > now : true;
		})
		.map((e) => ({
			eventName: e.title,
			eventDate: e.startTime, // formatted Eastern string — display only
			eventDesc: e.description,
			eventAddress: e.location,
			eventFlyer: e.flyerUrl ?? null,
			_sortDate: new Date(e.startTimeRaw).getTime(), // always valid ISO → reliable sort
		}))
		.sort((a, b) => a._sortDate - b._sortDate);

	useEffect(() => {
		if (!currentEvent && eventData.length > 0) {
			setCurrentEvent(eventData[0]);
		}
	}, [eventData, currentEvent]);

	const handleEventSelect = (event: Event) => {
		setCurrentEvent(event);
		setShowEventOnMobile(true);
	};

	const handleBackToSidebar = () => {
		setShowEventOnMobile(false);
	};

	return (
		<div className="">
			<div className="bg-black w-full h-fit flex flex-col px-10 items-center">
				<div className="p-20 bg-black items-center lg:items-start text-center lg:text-left lg:place-self-start place-self-center">
					<div className="font-[heading-font] text-white text-4xl lg:text-5xl lg:text-left text-center py-3">
						UPCOMING EVENTS
					</div>
					<div className="font-[body-font] text-white text-xl lg:text-2xl lg:text-left text-center">
						Experience IEEE @ UCF&rsquo;s exciting lineup of events this
						<span className="font-[subheading-font] text-[var(--ieee-bright-yellow)]">
							{' '}{currentMonth}{' '}
						</span>
						and beyond. Click on each event to learn more.
					</div>
				</div>
				<div className="flex flex-row h-fit w-full justify-between">
					{/* Main event display */}
					<div className={`lg:block w-3/4 ${showEventOnMobile ? 'hidden' : 'hidden lg:block'}`}>
						{currentEvent ? (
							<div className="relative group h-[60vh] lg:h-[90vh]">
								<div className="absolute -inset-1 bg-gradient-to-r from-[var(--ieee-bright-yellow)] to-[var(--ieee-bright-yellow)] rounded-sm blur opacity-50"></div>
								<div className="relative h-full bg-[#0c0a09] ring-1 ring-gray-900/5 rounded-sm leading-none flex items-top justify-start space-x-6">
									<div className="flex flex-row h-full rounded-sm p-10 gap-x-10 w-[70vw] xl:w-full">
										<Image
											className="object-cover rounded-sm w-[40vh] sm:w-[50vh] h-100vh"
											src={currentEvent.eventFlyer ?? '/larry.png'}
											alt="Event Flyer"
											width={2000}
											height={2000}
										/>
										<div className="m-5 flex flex-col gap-y-3">
											<div className="font-bold text-3xl text-white">
												{currentEvent.eventName}
											</div>
											<div className="text-xl text-white">
												{currentEvent.eventDesc}
											</div>
											<div className="flex flex-col justify-between">
												<div className="flex text-lg flex-row gap-x-2 text-white">
													<Calendar1 />
													{currentEvent.eventDate}
												</div>
												<div className="flex text-lg flex-row gap-x-2 text-white">
													<MapPin />
													{currentEvent.eventAddress}
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						) : (
							<div className="flex flex-col items-center justify-center h-[60vh] lg:h-[70vh]">
								<span>No event selected.</span>
							</div>
						)}
					</div>

					{/* Mobile event detail */}
					{showEventOnMobile && currentEvent && (
						<div className="w-full lg:hidden">
							<div className="relative group h-fit">
								<Button
									onClick={handleBackToSidebar}
									className="hover:scale-150 text-white cursor-pointer bg-transparent transition-transform hover:bg-transparent absolute top-4 right-4 z-20"
								>
									<X size={24} />
								</Button>
								<div className="absolute -inset-1 bg-gradient-to-r from-[var(--ieee-bright-yellow)] to-[var(--ieee-bright-yellow)] rounded-sm blur opacity-50"></div>
								<div className="relative h-full bg-[#0c0a09] ring-1 ring-gray-900/5 rounded-sm leading-none flex items-top justify-start space-x-6">
									<div className="flex flex-col lg:flex-row h-full rounded-sm p-6 lg:p-10 gap-6 lg:gap-x-10">
										<Image
											className="object-cover rounded-sm w-full lg:w-[50vh] h-fit lg:h-100vh mt-15"
											src={currentEvent.eventFlyer ?? '/larry.png'}
											alt="Event Flyer"
											width={2000}
											height={2000}
										/>
										<div className="flex flex-col gap-y-3">
											<div className="font-bold text-2xl lg:text-3xl text-white">
												{currentEvent.eventName}
											</div>
											<div className="text-lg lg:text-xl text-white">
												{currentEvent.eventDesc}
											</div>
											<div className="flex flex-col justify-between gap-y-2">
												<div className="flex text-base lg:text-lg flex-row gap-x-2 text-white">
													<Calendar1 />
													{currentEvent.eventDate}
												</div>
												<div className="flex text-base lg:text-lg flex-row gap-x-2 text-white">
													<MapPin />
													{currentEvent.eventAddress}
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					)}

					{/* Sidebar list */}
					<div className={`flex flex-col h-[60vh] lg:h-[90vh] overflow-y-scroll p-6 ${showEventOnMobile ? 'hidden lg:flex' : 'w-full lg:w-auto'}`}>
						{eventData.map((item, idx) => (
							<div
								className="hover:scale-102 transition hover:opacity-80 hover:z-100"
								key={`${idx}-${item.eventName}`}
							>
								<div
									className="group relative w-full overflow-hidden rounded-sm p-[3px] bg-transparent cursor-pointer transition-transform hover:scale-102"
									onMouseEnter={(e) => {
										const el = e.currentTarget.querySelector<HTMLDivElement>('.animated-border');
										if (el) el.style.animationPlayState = 'running';
									}}
									onMouseLeave={(e) => {
										const el = e.currentTarget.querySelector<HTMLDivElement>('.animated-border');
										if (el) el.style.animationPlayState = 'paused';
									}}
								>
									<div
										className="animated-border pointer-events-none absolute inset-0 z-0 rounded-sm bg-[conic-gradient(var(--ieee-bright-yellow)_20deg,transparent_120deg)] opacity-0 scale-95 transition-all duration-300 group-hover:opacity-100 group-hover:scale-100 animate-spin"
										style={{ animationPlayState: 'paused', animationDuration: '6s' }}
									/>
									<button
										onClick={() => handleEventSelect(item)}
										className="relative z-10 flex flex-row cursor-pointer bg-black rounded-sm w-full text-white hover:text-[var(--ieee-bright-yellow)]"
									>
										<div className="m-5 flex flex-col justify-center">
											<div className="flex flex-col justify-between">
												<div className="text-left font-bold text-lg">{item.eventName}</div>
												<div className="flex text-left gap-x-2 text-md">{item.eventDate}</div>
												<div className="flex text-left text-md">{item.eventAddress}</div>
											</div>
										</div>
									</button>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}