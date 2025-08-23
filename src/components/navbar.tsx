"use client";
import Link from "next/link";
import React, { useState } from "react";
import Image from "next/image";
import { XMarkIcon, Bars3Icon } from "@heroicons/react/24/solid";

const routes: { title: string; href: string }[] = [
  { title: "ABOUT", href: "/about" },
  { title: "EVENTS", href: "/events" },
  { title: "PROJECTS", href: "/projects"},
  { title: "SPONSORSHIPS", href: "/sponsorships"},
  { title: "CONNECT", href: "/connect"},
];

const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  
  return (
    <div className="relative flex items-center justify-between h-40 w-full">
      <div className="flex w-full justify-between m-6">
        <div className="flex justify-start items-center">
          <Link href={"/"} className="text-white font-[body-font] flex-row flex align-middle justify-center items-center gap-x-5 text-xl lg:text-2xl hover:text-[var(--ieee-dark-yellow)] transition">
            <Image className="object-contain" src="/IEEE-UCF-ICON.png" alt="IEEE UCF Logo" width={70} height={70} />IEEE UCF Student Chapter
          </Link>
        </div>

        <div className="justify-end justify-items-end sm:flex hidden">
        {routes.map((route, index) => (
            <Link
            key={index}
            href={route.href}
            className={
                route.title === "CONNECT"
                ? "relative group font-[heading-font] text-base lg:px-5 md:px-3 sm:px-1.5 bg-[var(--ieee-dark-yellow)] text-white items-center inline-flex h-fit py-2 my-18 w-fit rounded-lg transition"
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

        </div>
        {/* <Image className="object-contain" src="/ieeemasterbrand.png" alt="IEEE UCF Logo" width={70} height={70} /> */}
      </div>

      

      {menuOpen && <MobileMenu toggleMenu={toggleMenu} />}

      <button onClick={toggleMenu} className="sm:hidden bg-[var(--ieee-dark-yellow)] mr-5 z-50 cursor-pointer">
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
  return (
    <div className="fixed inset-0 flex flex-col z-40 bg-black h-fit max-w-screen">
      <div className="flex w-full grow flex-col gap-1 px-4 pb-2 py-12">
          <Link
            href="/"
            onClick={toggleMenu}
            className={"hover:text-[var(--ieee-bright-yellow)] font-[heading-font] text-white inline-flex h-10 w-full items-center text-sm transition-colors"}
          >
            HOME

          </Link>
        {routes.map((route, index) => (
          <Link
            key={index}
            href={route.href}
            onClick={toggleMenu}
            className={"hover:text-[var(--ieee-bright-yellow)] font-[heading-font] text-white inline-flex h-10 w-full items-center text-sm transition-colors"}
          >
            {route.title}
          </Link>
        ))}
        </div>
    </div>
  );
};

export { Navbar };
