'use client';
import { useRef, useEffect, useState } from 'react';
import { FaLinkedin } from 'react-icons/fa';
import Image from 'next/image';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Officer {
	name: string;
	type: 'Executive' | 'Chair';
	role: string;
	major: string;
	year: string;
	linkedin: string;
	photo: string;
	bio?: string;
}


const OFFICERS: Officer[] = [
	// Executive Board
	{
		name: 'Matthew Giannacco',
		type: 'Executive',
		role: 'President',
		major: 'Electrical Engineering',
		year: '3rd Year',
		linkedin: 'https://www.linkedin.com/in/matthew-giannacco/',
		photo: '/officers/matthew.jpg',
		bio: 'Matthew is a junior in Electrical Engineering at UCF with a strong focus on power electronics and analog systems. His interest in teaching emerged through his work as an Undergraduate Learning Assistant for Linear Circuits, where he developed a passion for service to others. This carried into his involvement with UCF\'s IEEE student branch, where he progressed from community service committee member to chair, and now serves as student branch president. In the coming year, he will be conducting research in Power Electronics and Radiation Effects. Outside the lab, Matthew spends his time hiking, cooking, working on cars, and staying active.',
	},
	{
		name: 'Jonathan David',
		type: 'Executive',
		role: 'Vice President',
		major: 'Electrical Engineering',
		year: '3rd Year',
		linkedin: 'https://www.linkedin.com/in/jonathanmichaeldavid99/',
		photo: '/officers/jonathan.jpg',
		bio: 'Junior studying Electrical Engineering. I\'ve been involved with IEEE UCF since 2025, starting as a committee member on the Professional Development team before serving as Pro Dev Chair in 2025–2026, where I led event planning, workshop development, and member outreach. Now serving as Vice President, I\'m focused on helping make this one of the chapter\'s strongest years.',
	},
	{
		name: 'Kevin Maa',
		type: 'Executive',
		role: 'Treasurer',
		major: 'Information Technology',
		year: '3rd Year',
		linkedin: 'https://www.linkedin.com/in/kevinmaa/',
		photo: '/officers/kevin.jpg',
	},
	{
		name: 'Tino Hernandez',
		type: 'Executive',
		role: 'Secretary',
		major: 'Electrical & Computer Engineering',
		year: '3rd Year',
		linkedin: 'https://www.linkedin.com/in/tino-hernandez-ee/',
		photo: '/officers/tino.jpg',
	},

	// Chairs
	{
		name: 'Dawn Balaschak',
		type: 'Chair',
		role: 'Software Chair',
		major: 'Computer Engineering',
		year: '3rd Year',
		linkedin: 'https://www.linkedin.com/in/dawnbalaschak',
		photo: '/officers/dawn.png',
	},
	{
		name: 'Jacob Beekman',
		type: 'Chair',
		role: 'Service Chair',
		major: 'Electrical Engineering',
		year: '3rd Year',
		linkedin: 'https://www.linkedin.com/in/jacob-beekman-40091529b/',
		photo: '/officers/jacob.jpeg',
		bio: 'Hi! My name is Jacob Beekman. I’m an electrical engineering student at UCF, and I’m the community service committee chair for the ‘26-‘27 school year. My hobbies are cooking, camping, and playing video games. I’m excited to be on the IEEE board for this year, and I’m looking forward to meeting new people, gaining new skills, and furthering my passion for electrical engineering!',
	},
	{
		name: 'Kealan Frost',
		type: 'Chair',
		role: 'Outreach Chair',
		major: 'Electrical Engineering',
		year: '4th Year',
		linkedin: 'https://www.linkedin.com/in/kealanfrost',
		photo: '/officers/kealan.png',
	},
	{
		name: 'Aldem Pido',
		type: 'Chair',
		role: 'Project Chair',
		major: 'Electrical Engineering',
		year: '4th Year',
		linkedin: 'https://www.linkedin.com/in/aldempido',
		photo: '/officers/aldem.jpeg',
		bio: 'EE Senior. I love making things, building and programming 10 different projects from hexapod robots to arcade machines. I\'ve interned at UCF STTC as an Embedded Engineer and Lockheed as a Systems Engineer. I\'m looking for full-time offers in either Hardware or Embedded after I graduate May 27.',
	},
	{
		name: 'Logan Martin',
		type: 'Chair',
		role: 'Workshop Chair',
		major: 'Electrical Engineering',
		year: '3rd Year',
		linkedin: 'https://www.linkedin.com/in/logan-martin-173385287/',
		photo: '/officers/logan.jpg',
	},
	{
		name: 'Charles Robert Diestro',
		type: 'Chair',
		role: 'Social Chair',
		major: 'Computer Engineering',
		year: '3rd Year',
		linkedin: 'https://www.linkedin.com/in/charles-robert-diestro-911960274/',
		photo: '/officers/charles.jpg',
		bio: 'Charles Robert Diestro is a third-year computer engineering student with a few certifications specializing in Autodesk software applications and CompTIA. Along with this, he uses the materials he has to design and create various projects that suit his own curiosity (personal projects, side projects, and hardware adjustments). In the software field he’s familiar with the languages of Python, C, Java, JavaScript, HTML, CSS, and a little bit of SQL. In the hardware field he’s dabbled in soldering, PC personalization, and plans to partake in more subjects like Raspberry Pi. With the remaining time he has at UCF, he plans to be more involved in IEEE projects to further expand his knowledge on what it means to be an experienced individual in the world of engineers.',
	},
	{
		name: 'Yousef Awad',
		type: 'Chair',
		role: 'Conference Chair',
		major: 'Computer Engineering',
		year: '3rd Year',
		linkedin: 'https://www.linkedin.com/in/yousefalaaawad/',
		photo: '/officers/yousef.png',
	},
	{
		name: 'James Gutierrez-Pinho',
		type: 'Chair',
		role: 'Pro Dev Chair',
		major: 'Electrical Engineering',
		year: '4th Year',
		linkedin: 'https://www.linkedin.com/in/jamesgutierrez-pinho/',
		photo: '/officers/james.jpg',
		bio: 'Hello everyone! My name is James Gutierrez-Pinho, and I am your IEEE Professional Development Chair. I am a rising senior in Electrical Engineering with interests in semiconductor characterization and IC design. Throughout the Fall and Spring semesters, we will be hosting a variety of professional development workshops featuring organizations and companies such as NASA, AMD, and the Georgia Tech Research Corporation.\n\nI look forward to engaging with our student body and helping students prepare for job interviews, strengthen their resumes, and connect with projects, opportunities, and IEEE resources through our mentorship program.',
	},
	{
		name: 'Peyton Barnes',
		type: 'Chair',
		role: 'Marketing Chair',
		major: 'Computer Engineering',
		year: '3rd Year',
		linkedin: 'https://www.linkedin.com/in/peytonlynnbarnes/',
		photo: '/officers/peyton.png',
	},
];

const OfficerImage = ({ src, alt }: { src: string; alt: string }) => {
	const [imgSrc, setImgSrc] = useState(src);

	useEffect(() => {
		setImgSrc(src);
	}, [src]);

	return (
		<Image
			src={imgSrc}
			alt={alt}
			fill
			className="object-cover"
			onError={() => setImgSrc('/iconography/ieeeucfsymbol.png')}
		/>
	);
};

export default function AboutOfficers() {
	const executiveRef = useRef<HTMLDivElement | null>(null);
	const chairRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		const animateRows = (containerRef: React.RefObject<HTMLDivElement | null>) => {
			if (!containerRef.current) return;
			const rows = containerRef.current.querySelectorAll('.officer-row');
			rows.forEach((row) => {
				gsap.fromTo(
					row,
					{ opacity: 0, y: 50 },
					{
						opacity: 1,
						y: 0,
						duration: 0.8,
						ease: 'power3.out',
						scrollTrigger: {
							trigger: row,
							start: 'top 70%',
						},
					},
				);
			});
		};

		animateRows(executiveRef);
		animateRows(chairRef);
	}, []);

	const groupOfficers = (officersList: Officer[], perRow = 4) => {
		const rows: Officer[][] = [];
		for (let i = 0; i < officersList.length; i += perRow) {
			rows.push(officersList.slice(i, i + perRow));
		}
		return rows;
	};

	const renderOfficerCard = (officer: Officer, index: number) => (
		<div
			key={index}
			className="w-70 h-110 m-2 relative rounded-sm border-1 border-white overflow-hidden shadow-lg transition-transform hover:scale-102"
		>
			<OfficerImage
				src={officer.photo}
				alt={officer.name}
			/>
			<div className="absolute inset-0 hover:bg-black/0 transition-colors bg-black/40 flex flex-col justify-end p-4 text-white">
				<span className="text-xl font-[heading-font]">{officer.name.toUpperCase()}</span>
				<span className="text-md font-[heading-font]">{officer.role.toUpperCase()}</span>
				<span className="text-sm font-[body-font]">{officer.year}</span>
				<span className="text-sm font-[body-font]">{officer.major}</span>
				<Link href={officer.linkedin} className="mt-2 inline-block">
					<FaLinkedin size={25} color="white" />
				</Link>
			</div>
		</div>
	);

	const renderRows = (officersList: Officer[]) => {
		const rows = groupOfficers(officersList);
		return rows.map((row, index) => (
			<div key={index} className="officer-row flex flex-row flex-wrap justify-center w-full">
				{row.map(renderOfficerCard)}
			</div>
		));
	};

	const executives = OFFICERS.filter((o) => o.type === 'Executive');
	const chairs = OFFICERS.filter((o) => o.type === 'Chair');

	return (
		<div className="flex flex-col items-center justify-center p-10 w-full gap-10">
			<div>
				<div className="text-center text-white font-[heading-font] text-3xl my-5">
					EXECUTIVE BOARD
				</div>
				<div ref={executiveRef} className="flex flex-col w-full gap-4">
					{renderRows(executives)}
				</div>
			</div>

			<div>
				<div className="text-center text-white font-[heading-font] text-3xl my-5">
					CHAIRS
				</div>
				<div ref={chairRef} className="flex flex-col w-full gap-4">
					{renderRows(chairs)}
				</div>
			</div>
		</div>
	);
}