'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import Autoplay from 'embla-carousel-autoplay';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';

// ---------------------------------------------------------------------------
// Hardcoded sponsor list — swap logos/names/URLs as needed
// ---------------------------------------------------------------------------
const SPONSORS: { name: string; logo: string; tier: string }[] = [
	{ name: 'Rex McCrary Foundation', logo: '/sponsors/rex.jpeg', tier: 'Gold' },
	{ name: 'Northrop Grumman', logo: '/sponsors/northrop.png', tier: 'Gold' },
	{ name: 'Cadence', logo: '/sponsors/cadence.png', tier: 'Gold' },
];

// ---------------------------------------------------------------------------
// mailto helper
// ---------------------------------------------------------------------------
interface MailToProps {
	email: string;
	subject?: string;
	body?: string;
	children?: React.ReactNode;
}

export const MailTo: React.FC<MailToProps> = ({ email, subject = '', body = '', children }) => (
	<a href={`mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`}>
		{children}
	</a>
);

// ---------------------------------------------------------------------------
// Sponsors Carousel
// ---------------------------------------------------------------------------
export const SponsorsCarousel: React.FC = () => (
	<div className="w-full py-14">
		<div className="text-center font-[heading-font] text-[var(--ieee-bright-yellow)] text-3xl mb-12">
			OUR SPONSORS
		</div>
		<Carousel
			opts={{ align: 'center', loop: true }}
			plugins={[Autoplay({ delay: 2500, stopOnInteraction: false })]}
			className="w-full"
		>
			<CarouselContent className="-ml-6">
				{SPONSORS.map((sponsor, index) => (
					<CarouselItem
						key={index}
						className="pl-6 basis-full sm:basis-1/2 md:basis-1/3"
					>
						<div className="flex flex-col items-center gap-4 group px-8 py-6">
							<div className="relative w-56 h-28 grayscale group-hover:grayscale-0 transition-all duration-300 opacity-70 group-hover:opacity-100">
								<Image src={sponsor.logo} alt={sponsor.name} fill className="object-contain" />
							</div>
							<span className="text-base text-gray-400 group-hover:text-[var(--ieee-bright-yellow)] font-[body-font] transition-colors text-center">
								{sponsor.name}
							</span>
							<span className="text-xs font-[heading-font] px-3 py-1 rounded-full border border-[var(--ieee-bright-yellow)] text-[var(--ieee-bright-yellow)] opacity-70 group-hover:opacity-100 transition-opacity tracking-widest uppercase">
								{sponsor.tier}
							</span>
						</div>
					</CarouselItem>
				))}
			</CarouselContent>
		</Carousel>
	</div>
);

// ---------------------------------------------------------------------------
// PDF Viewer — desktop: iframe via PDF.js; mobile: download/open card
// ---------------------------------------------------------------------------
const PDF_PATH = '/sponsors/IEEE_UCF_Sponsorship_Packet_2026_to_2027.pdf';

// Reusable glowing button shell
const GlowButton: React.FC<{ children: React.ReactNode }> = ({ children }) => (
	<div className="relative group cursor-pointer">
		<div className="absolute -inset-1 bg-gradient-to-r from-[var(--ieee-bright-yellow)] to-[var(--ieee-bright-yellow)] rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
		<div className="relative px-7 py-3 bg-[#0c0a09] ring-1 ring-gray-900/5 rounded-lg leading-none flex items-center justify-center space-x-2">
			{children}
		</div>
	</div>
);

export const PDFViewer: React.FC = () => {
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		const check = () => setIsMobile(window.innerWidth < 768);
		check();
		window.addEventListener('resize', check);
		return () => window.removeEventListener('resize', check);
	}, []);

	// ── Mobile: card with open / download buttons ───────────────────────────
	if (isMobile) {
		return (
			<div className="flex flex-col items-center gap-6 py-10 px-4 bg-[#111] rounded-xl border border-white/10">
				<svg className="w-14 h-14 text-[var(--ieee-bright-yellow)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 13h6M9 17h3" />
				</svg>
				<div className="text-center">
					<p className="text-white font-[heading-font] text-xl mb-1">IEEE UCF Sponsorship Package</p>
					<p className="text-gray-400 font-[body-font] text-sm">View the full sponsorship packet to learn about partnership opportunities.</p>
				</div>
				<div className="flex flex-row gap-4 w-full max-w-xs">
					<a href={PDF_PATH} target="_blank" rel="noopener noreferrer" className="flex-1">
						<GlowButton><span className="text-white font-[heading-font] text-sm">OPEN PDF</span></GlowButton>
					</a>
					<a href={PDF_PATH} download="IEEE-UCF-Sponsorship-Packet-2026-2027.pdf" className="flex-1">
						<GlowButton><span className="text-white font-[heading-font] text-sm">DOWNLOAD</span></GlowButton>
					</a>
				</div>
			</div>
		);
	}

	// ── Desktop: original direct iframe ─────────────────────────────────────
	return (
		<>
			<iframe
				src={PDF_PATH}
				width="100%"
				height="700px"
			/>
			<div className="my-10 flex flex-row flex-wrap items-center gap-x-5 lg:gap-x-10">
				<a href={PDF_PATH} download="IEEE-UCF-Sponsorship-Packet-2026-2027.pdf">
					<GlowButton><span className="text-white font-bold text-sm">DOWNLOAD</span></GlowButton>
				</a>
				<a href={PDF_PATH} target="_blank" rel="noopener noreferrer">
					<GlowButton><span className="text-white font-bold text-sm">OPEN IN NEW TAB</span></GlowButton>
				</a>
			</div>
		</>
	);
};