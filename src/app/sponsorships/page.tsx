// Server component — metadata export works because there's no "use client" here
import Image from 'next/image';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { Metadata } from 'next';
import { MailTo, SponsorsCarousel, PDFViewer } from '@/components/pg/sponsorshipsclient';

const pageTitle = 'Sponsorships | IEEE UCF';
const pageDescription =
	'To inquire about supporting IEEE UCF, view the sponsorship package or send a direct email.';

export const metadata: Metadata = {
	title: pageTitle,
	description: pageDescription,
	openGraph: {
		title: pageTitle,
		description: pageDescription,
		url: 'https://www.ieeeucf.com/sponsorships',
		type: 'website',
	},
};

export default function SponsorshipsPage() {
	return (
		<div className="flex flex-col max-w-screen overflow-hidden bg-black">
			{/* Hero */}
			<div className="relative w-full h-[120vh]">
				<div className="absolute z-4 w-full h-fit inset-0 items-center px-5">
					<Navbar />
				</div>

				<div className="absolute top-0 left-0 w-full h-full animated-background bg-gradient-to-r inset-0 items-center px-5 [background:radial-gradient(125%_125%_at_50%_10%,#0c0a09_5%,transparent_100%)] z-2" />

				<div className="flex flex-row my-20 p-40 justify-center absolute z-3 w-screen">
					<div className="flex flex-col items-center justify-center self-center text-center gap-y-5 float">
						<div className="font-[heading-font] text-[var(--ieee-bright-yellow)] text-5xl sm:text-6xl">
							SPONSORSHIPS
						</div>
						<div className="font-[body-font] text-white text-xl lg:text-2xl w-3/4">
							Without sponsors, nothing would be possible for IEEE @ UCF. To inquire
							about supporting IEEE @ UCF, view the sponsorship package below or click
							the button to send a direct email.
						</div>
						<div className="relative group cursor-pointer">
							<div className="absolute -inset-1 bg-gradient-to-r from-[var(--ieee-bright-yellow)] to-[var(--ieee-bright-yellow)] rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
							<div className="relative px-10 py-7 bg-[#0c0a09] ring-1 ring-gray-900/5 rounded-lg leading-none flex items-top justify-start space-x-6">
								<div className="space-y-2 text-white font-bold text-2xl">
									<MailTo email="ieee@ucf.edu" subject="Sponsorship Inquiry" body="Hello IEEE at UCF,">
										INQUIRE ABOUT SPONSORING
									</MailTo>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className="bg-black h-full w-full">
					<Image
						className="absolute h-full w-full object-cover z-0 opacity-50"
						src="/committees/socialgif2.gif"
						alt="About Us Photo"
						width={2000}
						height={2000}
					/>
				</div>
			</div>

			{/* Wave divider */}
			<div className="relative -translate-y-20 w-full overflow-hidden leading-none">
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-20">
					<defs>
						<radialGradient id="bg-gradient" cx="40%" cy="120%" r="125%">
							<stop offset="50%" stopColor="#000000" />
							<stop offset="100%" stopColor="#000000" />
						</radialGradient>
					</defs>
					<path
						d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86, 82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53, 26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
						fill="url(#bg-gradient)"
						transform="scale(1,-1) translate(0,-120)"
					/>
				</svg>
			</div>

			{/* Sponsors carousel */}
			<div className="px-10 bg-black border-b border-white/10">
				<SponsorsCarousel />
			</div>

			{/* PDF section — PDFViewer handles mobile vs desktop internally */}
			<div className="p-6 md:p-10 bg-black m-4 md:m-10 rounded-xl">
				<PDFViewer />
			</div>

			<Footer />
		</div>
	);
}