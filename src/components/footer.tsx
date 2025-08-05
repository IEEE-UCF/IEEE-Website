// i stole the component i made from another project... will edit later

"use client";
import Link from "next/link";
import React from "react";
import Image from "next/image";

import { Github, Instagram, Linkedin, Youtube, Facebook } from 'lucide-react';

const socials: { title: string; href: string; icon: React.ReactNode }[] = [
    { title: "instagram", href: "https://www.instagram.com/ieeeucf/?hl=en", icon: <Instagram className="w-5 h-5 text-white hover:text-[var(--ieee-bright-yellow)]" /> },
    { title: "linkedin", href: "https://www.linkedin.com/company/ieee-ucf/", icon: <Linkedin className="w-5 h-5 text-white hover:text-[var(--ieee-bright-yellow)]" /> },
    { title: "youtube", href: "https://www.youtube.com/@ieeeucf2287", icon: <Youtube className="w-5 h-5 text-white hover:text-[var(--ieee-bright-yellow)]" /> },
    { title: "facebook", href: "https://www.facebook.com/ieeeatucf/", icon: <Facebook className="w-5 h-5 text-white hover:text-[var(--ieee-bright-yellow)]" /> },
    { title: "github", href: "https://github.com/IEEE-UCF", icon: <Github className="w-5 h-5 text-white hover:text-[var(--ieee-bright-yellow)]" /> },
    
]; 

const Footer: React.FC = () => {
    return (
        <div className="justify-center items-center justify-items-center self-center place-items-center bg-black w-full  text-white ">
            <div className="bg-accent py-4 w-full"></div>
            <div className="w-full h-fit"></div>
            <div className="flex flex-row justify-between gap-x-2 p-10">
                <Image
                    className="h-40 w-40 object-cover"
                    src="/IEEEUCF_Logo.svg"
                    alt="Events Photo"
                    width={2000}
                    height={2000}
                />
                <div className="flex flex-col gap-y-2 place-self-center ">

                <div className="flex flex-row gap-x-3 items-center">
                    {/* <div className="text-white font-bold text-sm">ABOUT IEEE UCF</div> */}
                    <Link href={"/"} className="w-full font-extralight sm:w-auto text-white text-md font-['Open Sans'] hover:text-[var(--ieee-bright-yellow)]">HOME</Link>
                    |
                    <Link href={"/about"} className="w-full font-extralight sm:w-auto text-white text-md font-['Open Sans'] hover:text-[var(--ieee-bright-yellow)]">ABOUT</Link>
                    |
                    <Link href={"/connect"} className="w-full font-extralight sm:w-auto text-white text-md font-['Open Sans'] hover:text-[var(--ieee-bright-yellow)]">CONTACT</Link>  
                    |
                    <Link href={"https://www.ieee.org/accessibility_statement.html"} className="w-full font-extralight sm:w-auto text-white text-md font-['Open Sans'] hover:text-[var(--ieee-bright-yellow)]">ACCESSIBILITY</Link>  
                    |
                    <Link href={"https://www.ieee.org/nondiscrimination"} className="w-full font-extralight sm:w-auto text-white text-md font-['Open Sans'] hover:text-[var(--ieee-bright-yellow)]">NONDISCRIMINATION POLICY</Link>  
                    |
                    <Link href={"http://www.ieee-ethics-reporting.org"} className="w-full font-extralight sm:w-auto text-white text-md font-['Open Sans'] hover:text-[var(--ieee-bright-yellow)]">IEEE ETHICS REPORTING</Link>  
                    |
                    <Link href={"https://privacy.ieee.org/policies"} className="w-full font-extralight sm:w-auto text-white text-md font-['Open Sans'] hover:text-[var(--ieee-bright-yellow)]">IEEE PRIVACY POLICY</Link>  
                    |
                    <Link href={"https://www.ieee.org/site_terms_conditions.html"} className="w-full font-extralight sm:w-auto text-white text-md font-['Open Sans'] hover:text-[var(--ieee-bright-yellow)]">TERMS & DISCLOSURES</Link> 
                     
                </div>
                <div className="flex flex-row gap-x-4 items-center">
                    © Copyright 2025 IEEE – All rights reserved. A public charity, IEEE is the world's largest technical professional organization dedicated to advancing technology for the benefit of humanity.
                </div>
                <div className="flex flex-row gap-x-4 items-center">
                    Made with blood, sweat, and tears.
                </div>
                </div>

                {/* <div className="flex flex-col py-10 px-5 lg:px-10">
                    <div className="text-white font-bold text-sm font-['Open Sans']">RESOURCES</div>
                    <Link href={"https://www.ieee.org/"} className="w-full sm:w-auto font-extralight text-white text-sm font-['Open Sans'] hover:text-[var(--ieee-bright-yellow)]">ieee association</Link>
                    <Link href={"https://www.ucf.edu/"} className="w-full sm:w-auto font-extralight text-white text-sm font-['Open Sans'] hover:text-[var(--ieee-bright-yellow)]">university of central florida</Link>
                </div> */}
                {/* <div className="flex flex-row py-10 px-5 md:px-10 font-['Open Sans'] text-white text-sm font-bold">
                    <Link href={"https://discord.com/invite/WBcKem9kCq"} className="w-full sm:w-auto font-extralight text-white text-sm font-['Open Sans'] hover:text-[var(--ieee-bright-yellow)] p-1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M13.545 2.907a13.2 13.2 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.2 12.2 0 0 0-3.658 0 8 8 0 0 0-.412-.833.05.05 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.04.04 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032q.003.022.021.037a13.3 13.3 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019q.463-.63.818-1.329a.05.05 0 0 0-.01-.059l-.018-.011a9 9 0 0 1-1.248-.595.05.05 0 0 1-.02-.066l.015-.019q.127-.095.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.05.05 0 0 1 .053.007q.121.1.248.195a.05.05 0 0 1-.004.085 8 8 0 0 1-1.249.594.05.05 0 0 0-.03.03.05.05 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019 13.2 13.2 0 0 0 4.001-2.02.05.05 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.03.03 0 0 0-.02-.019m-8.198 7.307c-.789 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.45.73 1.438 1.613 0 .888-.637 1.612-1.438 1.612m5.316 0c-.788 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.451.73 1.438 1.613 0 .888-.631 1.612-1.438 1.612"/>
                            </svg>
                        </Link>
                    {socials.map((social, key) => {
                        return (
                            <Link key={key} href={social.href} className="m-1">
                                {social.icon}
                            </Link>
                        );
                    })}
                </div> */}
                {/* <div className="flex flex-col py-10 px-5 lg:px-10">
                    <div className="text-white font-bold text-sm font-['Open Sans']">SPONSORS</div>
                    <Link href={"/resources"} className="w-full sm:w-auto font-['Open Sans'] text-white text-sm font-extralight">resources</Link>
                </div> */}
            </div>
        </div>
    );
};

export { Footer };
