"use client";

import Image from "next/image";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import Link from "next/link";

import { useState, useEffect } from 'react';

import { SiLinkedin } from "react-icons/si";

import {
    Card,
    CardContent,
} from "@/components/ui/card"

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

import { Linechart } from "@/components/ui/linechart";


export default function About() {
    
    interface Officer {
        name: string;
        type: string;
        role: string;
        major: string;
        year: string;
        linkedin: string;
        bio: string;
        photo: string;
        
    }

    interface Award {
        _id: string; 
        category: string; 
        event: string; 
        place: string; 
        team: {
          person: string; 
        };
    }

    

    const [officers, setOfficers] = useState<Officer[]>([]);

    const [awards, setAwards] = useState<Award[]>([]);

    useEffect(() => {
        fetchOfficers();
        fetchAwards();

    }, []);

    const fetchOfficers = async () => {
        const res = await fetch("/api/officers", {method: "GET"} );
        const officers = await res.json();
        setOfficers(officers.data);

    }

    const fetchAwards = async () => {
        const res = await fetch("/api/awards", {method: "GET"} );
        const awards = await res.json();
        setAwards(awards.data);

    }

    return (
        <div className="flex flex-col max-w-screen overflow-hidden">

            <div className="relative w-full h-[120vh]">
                
                <div className="absolute z-4 w-full h-fit inset-0 items-center px-5">
                    <Navbar />

                </div>

                <div className="absolute top-0 left-0 w-full h-full animated-background bg-gradient-to-r   inset-0 items-center px-5 [background:radial-gradient(125%_125%_at_50%_10%,#0c0a09_5%,transparent_100%)] z-2"></div>

                <div className="flex flex-row my-20 p-40 justify-end absolute z-3 w-screen">
                    <div className="flex flex-col items-end justify-end self-end text-right gap-y-5">
                        <div className="font-[heading-font] text-[var(--ieee-bright-yellow)] text-6xl">WHAT IS IEEE?</div>
                        <div className="font-[subheading-font] text-white text-xl w-3/4">IEEE at UCF is the student branch of the world’s largest professional organization for electrical and electronics engineers. We're a community of students passionate about circuits, computing, robotics, embedded systems, and everything in between. Through hands-on projects, professional development, and outreach, we help each other grow into the engineers and innovators of tomorrow.</div>
                        
                
                        <div className="relative group cursor-pointer">
                            <div className="absolute -inset-1 bg-gradient-to-r from-[var(--ieee-bright-yellow)] to-[var(--ieee-bright-yellow)] rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                                
                            <div className="relative px-7 py-6 bg-[#0c0a09] ring-1 ring-gray-900/5 rounded-lg leading-none flex items-top justify-start space-x-6">
                                <div className="space-y-2">
                                    <Link href = "https://www.youtube.com/watch?v=JyjVBBVm0g4">
                                        <p className="text-white text-xl font-[heading-font]">WATCH VIDEO</p>
                                    </Link>
                                </div>
                            </div>
                        </div>
                
                    </div>
                </div>

                <div className="bg-black h-full w-full">
                    <Image
                        className="absolute h-full w-full object-cover z-0 opacity-50"
                        src="/SEC-Hardware.jpg"
                        alt="About Us Photo"
                        width={2000}
                        height={2000}
                    />
                </div>
                
            </div>

            <div className="flex flex-row max-w-screen justify-between gap-x-3 bg-black">
                <div className="h-auto p-20 text-white w-1/2">
                        <div className="font-[body-font] text-[var(--ieee-bright-yellow)] text-3xl">IEEE UCF IN A NUTSHELL</div>
                        <Accordion type="single" collapsible>
                            <AccordionItem value="item-1">
                                <AccordionTrigger className="text-lg cursor-pointer">AWARDS AND ACCOMPLISHMENTS</AccordionTrigger>
                                <AccordionContent>
                                    {Object.entries(
                                        awards.reduce((acc, award) => {
                                            if (!acc[award.category]) {
                                            acc[award.category] = [];
                                            }
                                            acc[award.category].push(award);
                                            return acc;

                                        }, {} as { [key: string]: Award[] }) 
                                        ).map(([category, awardsInCategory], index) => (
                                        <div key={index} className="mb-5">
                                            <div className="text-[var(--ieee-bright-yellow)] text-lg font-bold mb-2">
                                            {category}
                                            </div>

                                            {awardsInCategory.map((award, awardIndex) => (
                                            <div key={awardIndex} className="text-white text-sm">
                                                <p>{award.event} – {award.place}</p>
                                            </div>
                                            ))}
                                        </div>
                                    ))}
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-2">
                                <AccordionTrigger className="text-lg cursor-pointer">TECHNICAL DEVELOPMENT</AccordionTrigger>
                                <AccordionContent>
                                    Lorem ipsum dolor sit amet consectetur adipiscing elit. Amet consectetur adipiscing elit quisque faucibus ex sapien. Quisque faucibus ex sapien vitae pellentesque sem placerat. Vitae pellentesque sem placerat in id cursus mi.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-3">
                                <AccordionTrigger className="text-lg cursor-pointer">SOUTHEASTCON HARDWARE TEAM</AccordionTrigger>
                                <AccordionContent>
                                    Lorem ipsum dolor sit amet consectetur adipiscing elit. Amet consectetur adipiscing elit quisque faucibus ex sapien. Quisque faucibus ex sapien vitae pellentesque sem placerat. Vitae pellentesque sem placerat in id cursus mi.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-4">
                                <AccordionTrigger className="text-lg cursor-pointer">COMMUNITY SERVICE</AccordionTrigger>
                                <AccordionContent>
                                    Lorem ipsum dolor sit amet consectetur adipiscing elit. Amet consectetur adipiscing elit quisque faucibus ex sapien. Quisque faucibus ex sapien vitae pellentesque sem placerat. Vitae pellentesque sem placerat in id cursus mi.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-5">
                                <AccordionTrigger className="text-lg cursor-pointer">SOCIAL EVENTS</AccordionTrigger>
                                <AccordionContent>
                                    Lorem ipsum dolor sit amet consectetur adipiscing elit. Amet consectetur adipiscing elit quisque faucibus ex sapien. Quisque faucibus ex sapien vitae pellentesque sem placerat. Vitae pellentesque sem placerat in id cursus mi.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-6">
                                <AccordionTrigger className="text-lg cursor-pointer">PROFESSIONAL DEVELOPMENT</AccordionTrigger>
                                <AccordionContent>
                                    Lorem ipsum dolor sit amet consectetur adipiscing elit. Amet consectetur adipiscing elit quisque faucibus ex sapien. Quisque faucibus ex sapien vitae pellentesque sem placerat. Vitae pellentesque sem placerat in id cursus mi.
                                </AccordionContent>
                            </AccordionItem>

                        </Accordion>
                </div>

                {/* rawdogging this linechart lol */}
                {/* it's fucking broken (never coding on an airplane again) */}
                <Linechart/> 
                {/* <Barchart/> */}
             

            </div>
            
            <div className="flex flex-col items-center align-middle justify-center p-10 w-full">
                <div className="bg-black rounded-lg p-5 m-5 w-full drop-shadow-lg ">
                    <div className="text-center text-white font-[heading-font] text-3xl my-5">EXECUTIVE BOARD</div>
                    <div className="flex flex-row flex-wrap justify-center">
                        { officers.map((officer, index) => (
                            (officer.type === "Executive") && ( 
                                <div key={index} className="">


                                    <Card className="w-60 h-100 m-3 hover:scale-102 transition-transform">
                                        <CardContent className="flex w-full justify-center flex-col items-center align-middle p-4">
                                            <Image 
                                                className="object-center object-cover w-45 h-45 rounded-xl" 
                                                src={officer.photo}
                                                alt="IEEE Logo" 
                                                width={2000} 
                                                height={2000} 
                                                        
                                            />
                                            <div className="my-2"></div>

                                            <span className="text-xl font-[heading-font] text-[var(--ieee-bright-yellow)] inline-flex text-center">{officer.name.toUpperCase()}</span>
                                            <span className="text-md font-[heading-font] inline-flex text-center">{officer.role.toUpperCase()}</span>
                                            <span className="text-sm font-[body-font] inline-flex text-center">{officer.year}</span>
                                            <span className="text-sm font-[body-font] inline-flex text-center">{officer.major}</span>
                                            <Link href={officer.linkedin} className="m-2  transition-transform">
                                                <SiLinkedin size="25" color="black"/>
                                            </Link>
                                        </CardContent>
                                    </Card>

                                </div>
                            )
                            
                        ))
                        }

                    </div>
                </div>

                <div className="bg-black rounded-lg p-5 m-5 w-full drop-shadow-lg ">
                    <div className="text-center text-white font-[heading-font] text-3xl my-5">CHAIRS</div>
                    <div className="flex flex-row flex-wrap justify-center">
                        { officers.map((officer, index) => (
                            (officer.type === "Chair") && ( 
                                <div key={index} className="">


                                    <Card className="w-60 h-100 m-3 hover:scale-102 transition-transform">
                                        <CardContent className="flex w-full justify-center flex-col items-center align-middle p-4">
                                            <Image 
                                                className="object-center object-cover w-45 h-45 rounded-xl" 
                                                src={officer.photo}
                                                alt="IEEE Logo" 
                                                width={2000} 
                                                height={2000} 
                                                        
                                            />

                                            <div className="my-2"></div>

                                            <span className="text-xl font-[heading-font] text-[var(--ieee-bright-yellow)] inline-flex text-center">{officer.name.toUpperCase()}</span>
                                            <span className="text-md font-[heading-font] inline-flex text-center">{officer.role.toUpperCase()}</span>
                                            <span className="text-sm font-[body-font] inline-flex text-center">{officer.year}</span>
                                            <span className="text-sm font-[body-font] inline-flex text-center">{officer.major}</span>
                                            <Link href={officer.linkedin} className="m-2  transition-transform">
                                                <SiLinkedin size="25" color="black"/>
                                            </Link>
                                        </CardContent>
                                    </Card>

                                </div>
                            )
                            
                        ))
                        }

                    </div>
                </div>

            </div>
        <Footer/>


        </div>
    );
};