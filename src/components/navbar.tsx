'use client';
import Link from 'next/link';
import React, { useState } from 'react';
import Image from 'next/image';
import { XMarkIcon, Bars3Icon } from '@heroicons/react/24/solid';
import { trpc } from '@/lib/trpc/client';
import { AvatarMenu } from './avatarmenu';

const routes: { title: string; href: string; image: string }[] = [
	{ title: 'About', href: '/about', image: '/iconography/navbarabout.png' },
	{ title: 'Events', href: '/events', image: '/iconography/navbarevents.png' },
	{ title: 'Projects', href: '/projects', image: '/iconography/navbarprojects.png' },
	{ title: 'Sponsorships', href: '/sponsorships', image: '/iconography/navbarsponsorships.png' },
	{ title: 'Connect', href: '/connect', image: '/iconography/navbarconnect.png' },
];

const authRoutes: { title: string; href: string; image: string }[] = [
	{ title: 'Dashboard', href: '/dashboard', image: '/iconography/navbardashboard.png' },
	{ title: 'Settings', href: '/settings', image: '/iconography/navbarsettings.png' },
];

const adminRoutes: { title: string; href: string; image: string }[] = [
	{
		title: 'Admin Dashboard',
		href: '/admin/dashboard',
		image: '/iconography/navbardashboard.png',
	},
	{
		title: 'Demo Event Scanner',
		href: '/test/scan-qr',
		image: '/iconography/navbardashboard.png',
	},
	{ title: 'Testing', href: '/test/demos', image: '/iconography/navbardashboard.png' },
];

const Navbar: React.FC = () => {
	const { data: auth } = trpc.auth.getAuthStatus.useQuery();
	const [menuOpen, setMenuOpen] = useState(false);

	const toggleMenu = () => {
		setMenuOpen(!menuOpen);
	};

	return (
		<div className="relative flex items-center justify-between h-40 w-full">
			<div className="flex w-full justify-between m-6">
				<div className="flex justify-start items-center">
					<Link
						href={'/'}
						className="text-white font-[body-font] flex-row flex align-middle justify-center items-center gap-x-5 text-xl lg:text-2xl hover:text-[var(--ieee-dark-yellow)] transition"
					>
						<Image
							className="object-contain"
							src="/iconography/ieeeucficon.png"
							alt="IEEE UCF Logo"
							width={70}
							height={70}
						/>
						IEEE @ UCF Student Chapter
					</Link>
				</div>

        <div className="justify-end justify-items-end sm:flex hidden">
        {routes.map((route, index) => (
            <Link
            key={index}
            href={route.href}
            className={
                route.title === "CONNECT"
                ? "relative group font-[heading-font] text-base lg:px-4 md:px-2 sm:px-1 bg-[var(--ieee-dark-yellow)] text-white items-center inline-flex h-fit py-1 rounded-sm my-18 w-fit transition"
                : "font-[body-font] lg:px-5 md:px-3 sm:px-1.5 text-sm items-center inline-flex text-white hover:text-[var(--ieee-dark-yellow)] transition"
            }
            >
            {route.title === "CONNECT" && (
                <>
                <div
                    className="absolute inset-0 bg-gradient-to-r from-[var(--ieee-bright-yellow)] to-[var(--ieee-bright-yellow)] rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"
                ></div>
                <div className="relative p-2  rounded-lg">
                    {route.title}
                </div>
                </>
            )}
            {route.title !== "CONNECT" && route.title}
            </Link>
        ))}

					{auth?.isAdmin && (
						<div className="flex items-center gap-3 border-l border-gray-700 pl-4 ml-2">
							<span className="text-xs font-[heading-font] tracking-[0.2em] text-[var(--ieee-dark-yellow)]">
								ADMIN
							</span>
							{adminRoutes.map((route, index) => (
								<Link
									key={index}
									href={route.href}
									className="font-[body-font] text-xs items-center inline-flex text-white hover:text-[var(--ieee-dark-yellow)] transition"
								>
									{route.title.toUpperCase()}
								</Link>
							))}
						</div>
					)}

					{auth?.isMember && auth?.discordAvatar ? (
						<div className="">
							{/* <Image
								className="object-cover rounded-full h-10 w-10 border border-white"
								src={auth?.discordAvatar}
								alt="Profile"
								width={2000}
								height={2000}
						/> */}

							<AvatarMenu image={auth?.discordAvatar}></AvatarMenu>
						</div>
					) : (
						<div>
							<Link
								href="/auth/signin"
								className="relative group font-[heading-font] text-base lg:px-4 md:px-2 sm:px-1
							bg-[var(--ieee-dark-yellow)] text-white items-center inline-flex h-fit py-3
							rounded-sm w-fit transition"
							>
								<div
									className="absolute inset-0 bg-gradient-to-r from-[var(--ieee-bright-yellow)]
							to-[var(--ieee-bright-yellow)] rounded-sm blur opacity-25
							group-hover:opacity-100 transition duration-1000 group-hover:duration-200"
								></div>

								<div className="relative px-2">SIGN IN</div>
							</Link>
						</div>
					)}
				</div>

				{/* <Image className="object-contain" src="/ieeemasterbrand.png" alt="IEEE UCF Logo" width={70} height={70} /> */}
			</div>

			{menuOpen && <MobileMenu toggleMenu={toggleMenu} />}
			{menuOpen && <MobileMenu toggleMenu={toggleMenu} />}

			<button
				onClick={toggleMenu}
				className="lg:hidden bg-[var(--ieee-dark-yellow)] mr-5 z-50 cursor-pointer"
			>
				{menuOpen ? (
					<XMarkIcon className="h-7 w-7 fixed bg-[var(--ieee-dark-yellow)] -translate-x-7 -translate-y-3.5 z-50" />
				) : (
					<Bars3Icon className="h-7 w-7" />
				)}
			</button>
		</div>
	);
};

const MobileMenu: React.FC<{ toggleMenu: () => void }> = ({ toggleMenu }) => {
	const { data: auth } = trpc.auth.getAuthStatus.useQuery();

	return (
		<div className="fixed inset-0 flex flex-col z-40 bg-black h-screen max-w-screen">
			<div className="flex w-full grow flex-col mt-5 mb-5 overflow-y-auto">
				<div className="text-white font-[body-font] flex-row flex  gap-x-5 text-xl lg:text-2xl items-center gap-5 m-6 px-5">
					<Image
						className="object-contain"
						src="/iconography/ieeeucficon.png"
						alt="IEEE UCF Logo"
						width={70}
						height={70}
					/>
					IEEE @ UCF Student Chapter
				</div>

				{/* <div className="flex w-full justify-between m-6">
				<div className="flex justify-start items-center">
					<Link href={"/"} className="text-white font-[body-font] flex-row flex align-middle justify-center items-center gap-x-5 text-xl lg:text-2xl hover:text-[var(--ieee-dark-yellow)] transition">
						<Image className="object-contain" src="/iconography/ieeeucficon.png" alt="IEEE UCF Logo" width={70} height={70} />IEEE @ UCF Student Chapter
					</Link>
				</div> */}
				{auth?.isMember ? (
					<div className="flex flex-col bg-[var(--ieee-dark-yellow)] p-5">
						<div className="">
							<div className="text-white font-[heading-font] text-xl">
								{auth?.member?.firstName.toUpperCase()}{' '}
								{auth?.member?.lastName.toUpperCase()}
							</div>
						</div>
					</div>
				) : (
					<div className=""></div>
				)}

				<div className="flex flex-col p-5">
					<div className="text-[var(--ieee-dark-yellow)] font-[heading-font] ml-6 text-xl">
						CLUB
					</div>
					<div className="ml-6">
						<Link
							href="/"
							onClick={toggleMenu}
							className={
								'hover:text-[var(--ieee-bright-yellow)] font-[subheading-font] text-white inline-flex h-10 w-full items-center text-md transition-colors gap-3'
							}
						>
							<Image
								className="object-cover h-7 w-7"
								src="/iconography/navbarhome.png"
								alt="Profile"
								width={2000}
								height={2000}
							/>
							Home
						</Link>

						{routes.map((route, index) => (
							<Link
								key={index}
								href={route.href}
								onClick={toggleMenu}
								className={
									'hover:text-[var(--ieee-bright-yellow)] font-[subheading-font] text-white inline-flex h-10 w-full items-center text-md transition-colors gap-3'
								}
							>
								<Image
									className="object-cover h-7 w-7"
									src={route.image}
									alt="Profile"
									width={2000}
									height={2000}
								/>

								{route.title}
							</Link>
						))}
					</div>
				</div>

				{/* Mobile ADMIN section for admins */}
				{auth?.isAdmin && (
					<div className="flex flex-col ml-6 p-5">
						<div className="text-[var(--ieee-dark-yellow)] font-[heading-font] text-xl">
							ADMIN
						</div>
						{adminRoutes.map((route, index) => (
							<Link
								key={index}
								href={route.href}
								onClick={toggleMenu}
								className={
									'hover:text-[var(--ieee-bright-yellow)] font-[subheading-font] text-white inline-flex h-10 w-full items-center text-md transition-colors gap-3'
								}
							>
								<Image
									className="object-cover h-7 w-7"
									src={route.image}
									alt="Profile"
									width={2000}
									height={2000}
								/>

								{route.title}
							</Link>
						))}
					</div>
				)}

				{/* Mobile ACCOUNT section */}
				{auth?.isMember ? (
					<div className="flex flex-col ml-6  p-5">
						<div className="text-[var(--ieee-dark-yellow)] font-[heading-font]  text-xl">
							ACCOUNT
						</div>

						{authRoutes.map((route, index) => (
							<Link
								key={index}
								href={route.href}
								onClick={toggleMenu}
								className={
									'hover:text-[var(--ieee-bright-yellow)] font-[subheading-font] text-white inline-flex h-10 w-full items-center text-md transition-colors gap-3'
								}
							>
								<Image
									className="object-cover h-7 w-7"
									src={route.image}
									alt="Profile"
									width={2000}
									height={2000}
								/>

								{route.title}
							</Link>
						))}
					</div>
				) : (
					<Link
						href="/auth/signin"
						className="relative group font-[heading-font] text-base lg:px-4 md:px-2 sm:px-1
							bg-[var(--ieee-dark-yellow)] text-white  inline-flex h-fit py-3
							rounded-sm m-6 transition w-2/5 self-center items-center justify-center align-middle"
					>
						<div
							className="absolute inset-0 bg-gradient-to-r from-[var(--ieee-bright-yellow)]
							to-[var(--ieee-bright-yellow)] rounded-sm blur opacity-25
							group-hover:opacity-100 transition duration-1000 group-hover:duration-200"
						></div>

						<div className="relative px-2 text-center">SIGN IN</div>
					</Link>
				)}
			</div>
		</div>
	);
};

export { Navbar };