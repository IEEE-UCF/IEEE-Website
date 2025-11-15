// i stole the component i made from another project... will edit later

"use client";
import Link from "next/link";
import React from "react";
import Image from "next/image";

// import { Github, Instagram, Linkedin, Youtube, Facebook } from 'lucide-react';

// const socials: { title: string; href: string; icon: React.ReactNode }[] = [
//     { title: "instagram", href: "https://www.instagram.com/ieeeucf/?hl=en", icon: <Instagram className="w-5 h-5 text-white hover:text-[var(--ieee-bright-yellow)]" /> },
//     { title: "linkedin", href: "https://www.linkedin.com/company/ieee-ucf/", icon: <Linkedin className="w-5 h-5 text-white hover:text-[var(--ieee-bright-yellow)]" /> },
//     { title: "youtube", href: "https://www.youtube.com/@ieeeucf2287", icon: <Youtube className="w-5 h-5 text-white hover:text-[var(--ieee-bright-yellow)]" /> },
//     { title: "facebook", href: "https://www.facebook.com/ieeeatucf/", icon: <Facebook className="w-5 h-5 text-white hover:text-[var(--ieee-bright-yellow)]" /> },
//     { title: "github", href: "https://github.com/IEEE-UCF", icon: <Github className="w-5 h-5 text-white hover:text-[var(--ieee-bright-yellow)]" /> },

// ];

const Footer: React.FC = () => {
	return (
		<div className="bg-black w-full text-white flex flex-col items-center justify-center">
			<div className="bg-accent w-full"></div>
			<div className="w-full h-fit"></div>
			<div className="flex flex-col md:flex-row md:justify-between gap-y-6 md:gap-x-2 px-4 py-8 md:p-10 w-full max-w-screen-xl">
				<div className="flex md:justify-start mb-4 md:mb-0 justify-center">
					<Image
						className="h-24 w-24 md:h-40 md:w-40 object-cover"
						src="/iconography/ieeeucflogo.png"
						alt="Events Photo"
						width={2000}
						height={2000}
					/>
				</div>
				<div className="flex flex-col gap-y-1 w-full md:w-auto items-center md:items-start md:justify-center">
					<div className="flex flex-wrap justify-center md:justify-start gap-x-3 gap-y-2 items-center text-xs md:text-sm">
						<Link href={"/"} className="font-extralight text-white font-['Open Sans'] hover:text-[var(--ieee-bright-yellow)]">HOME</Link>
						<span className="text-xl font-[body-font] hidden md:inline">|</span>
						<Link href={"/about"} className="font-extralight text-white font-['Open Sans'] hover:text-[var(--ieee-bright-yellow)]">ABOUT</Link>
						<span className="text-xl font-[body-font] hidden md:inline">|</span>
						<Link href={"/connect"} className="font-extralight text-white font-['Open Sans'] hover:text-[var(--ieee-bright-yellow)]">CONTACT</Link>
					</div>
					<div className="flex flex-wrap justify-center md:justify-start gap-x-3 gap-y-2 items-center text-xs md:text-sm">
						<Link href={"https://www.ieee.org/accessibility_statement.html"} className="font-extralight text-white font-['Open Sans'] hover:text-[var(--ieee-bright-yellow)]">ACCESSIBILITY</Link>
						<span className="text-xl font-[body-font] hidden md:inline">|</span>
						<Link href={"https://www.ieee.org/nondiscrimination"} className="font-extralight text-white font-['Open Sans'] hover:text-[var(--ieee-bright-yellow)]">NONDISCRIMINATION POLICY</Link>
						<span className="text-xl font-[body-font] hidden md:inline">|</span>
						<Link href={"http://www.ieee-ethics-reporting.org"} className="font-extralight text-white font-['Open Sans'] hover:text-[var(--ieee-bright-yellow)]">IEEE ETHICS REPORTING</Link>
						<span className="text-xl font-[body-font] hidden md:inline">|</span>
						<Link href={"https://privacy.ieee.org/policies"} className="font-extralight text-white font-['Open Sans'] hover:text-[var(--ieee-bright-yellow)]">IEEE PRIVACY POLICY</Link>
						<span className="text-xl font-[body-font] hidden md:inline">|</span>
						<Link href={"https://www.ieee.org/site_terms_conditions.html"} className="font-extralight text-white font-['Open Sans'] hover:text-[var(--ieee-bright-yellow)]">TERMS & DISCLOSURES</Link>
					</div>
					<div className="flex flex-col md:flex-row gap-y-2 gap-x-4 items-center text-xs md:text-base text-center md:text-left w-full">
                        © Copyright 2025 IEEE – All rights reserved. A public charity, IEEE is the world’s largest technical professional organization dedicated to advancing technology for the benefit of humanity.
					</div>
				</div>
			</div>
		</div>
	);
};

export { Footer };
