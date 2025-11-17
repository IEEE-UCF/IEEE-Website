import Image from "next/image";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";


import { Metadata } from "next";
import EventSidebar from "@/components/pg/eventsidebar";

const pageTitle = "Events | IEEE UCF";
const pageDescription = "IEEE UCF offers technical workshops, career sessions, social events, and service opportunities to help students grow skills and expand networks.";

export const metadata: Metadata = {
	title: pageTitle,
	description: pageDescription,
	openGraph: {
		title: pageTitle,
		description: pageDescription,
		url: "https://www.ieeeucf.com/events",
		type: "website",
	},
};

export default function EventsPage() {

	return (
		<div className="flex flex-col max-w-screen overflow-hidden">
			<div className="relative w-full h-[120vh]">
				<div className="absolute z-4 w-full h-fit inset-0 items-center px-5">
					<Navbar />
				</div>

				<div className="absolute top-0 left-0 w-full h-full animated-background bg-gradient-to-r   inset-0 items-center px-5 [background:radial-gradient(125%_125%_at_50%_10%,#0c0a09_5%,transparent_100%)] z-2"></div>

				<div className="flex flex-row my-30 p-40 px-10 md:px-20 lg:px-40 justify-center lg:justify-end absolute z-3 w-screen">
					<div className="flex flex-col items-center lg:items-end justify-center lg:justify-end self-end text-center lg:text-right gap-y-5 float">
						<div className="font-[heading-font] text-[var(--ieee-bright-yellow)] text-5xl sm:text-6xl">
              EVENTS
						</div>
						<div className="font-[body-font] text-white text-xl lg:text-2xl w-3/4">
              From technical workshops to career-building sessions to social gatherings to community service
              opportunities, there is unlimited opportunity to expand networks and grow skills in IEEE @ UCF.
						</div>
					</div>
				</div>

				<div className="bg-black h-full w-full">
					<Image
						className="absolute h-full w-full object-cover z-0 opacity-70"
						src="/gbms/gbmgif.gif"
						alt="Events Photo"
						width={2000}
						height={2000}
					/>
				</div>
			</div>

			<div className="relative -translate-y-20 w-full overflow-hidden leading-none">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 1200 120"
					preserveAspectRatio="none"
					className="w-full h-20"
				>
					<defs>
						<radialGradient id="bg-gradient3" cx="40%" cy="120%" r="125%">
							<stop offset="50%" stopColor="#000000" />
							<stop offset="100%" stopColor="#000000" />
						</radialGradient>
					</defs>

					<path
						d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86, 82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53, 26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
						fill="url(#bg-gradient3)"
						transform="scale(1,-1) translate(0,-120)" // Flips over X-axis
					/>
				</svg>
			</div>
			<div className="-translate-y-20">

				<EventSidebar/>
				<div className="p-10 bg-black"></div>


			</div>


			<div className="-mt-20">
				<Footer />
			</div>

		</div>
	);
}
