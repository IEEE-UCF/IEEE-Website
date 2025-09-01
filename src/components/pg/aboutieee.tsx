"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

import Image from "next/image";

import {useState, useEffect} from "react";

    interface Award {
        _id: string; 
        category: string; 
        event: string; 
        place: string; 
        team: {
          person: string; 
        };
    }

export default function AboutIEEE() {
    const [awards, setAwards] = useState<Award[]>([]);

    useEffect(() => {
        fetchAwards();

    }, []);

     const fetchAwards = async () => {
        const res = await fetch("/api/awards", {method: "GET"} );
        const awards = await res.json();
        setAwards(awards.data);

    }

    return (
    <div className="">
        <Accordion type="single" collapsible>
                            <AccordionItem value="item-1">
                                <AccordionTrigger className="text-2xl font-[subheading-font] cursor-pointer">AWARDS AND ACCOMPLISHMENTS</AccordionTrigger>
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
                                            <div className="text-[var(--ieee-bright-yellow)] text-2xl font-[subheading-font] mb-2">
                                            {category}
                                            </div>

                                            {awardsInCategory.map((award, awardIndex) => (
                                            <div key={awardIndex} className="text-white text-lg font-[body-font]"> 
                                                {award.place ? 
                                                    (<p>{award.event} – {award.place}</p>) 
                                                    : 
                                                    (<p>{award.event}</p>)
                                                }
                                            </div>
                                            ))}
                                        </div>
                                    ))}
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-2">
                                <AccordionTrigger className="text-2xl font-[subheading-font] cursor-pointer">TECHNICAL DEVELOPMENT</AccordionTrigger>
                                <AccordionContent>
                                    <div className="text-[var(--ieee-bright-yellow)] text-lg font-[subheading-italic-font] py-2">
                                        Workshops and projects are premier opportunities for IEEE UCF members to advance their technical knowledge and experience.
                                    </div>
                                    <div className="text-white text-lg font-[body-font] py-2">
                                        The Workshop Committee offers specialized, expert-led sessions on topics such as circuit analysis, Verilog, soldering, wiring, microcontroller programming, and beyond. These workshops provide members with valuable technical skills often not introduced until later stages of their academic careers, giving them a significant early advantage. Additionally, IEEE UCF members have the opportunity to lead and participate in a variety of club-funded engineering projects – including the Internal Project Competition, Micromouse, and Guitar Hero. These projects enable members to apply their skills in real-world, collaborative environments while making impactful additions to their resumes.
                                    </div>
                                    <div className="flex flex-row">
                                        <Image
                                        className="md:w-1/2 h-120 object-cover p-3 hover:scale-102 transition-transform"
                                        src="/committees/workshop1.png"
                                        alt="Workshop Photo"
                                        width={2000}
                                        height={2000}
                                        />

                                        <Image
                                            className="md:w-1/2 h-120 object-cover p-3 hover:scale-102 transition-transform"
                                            src="/committees/workshop2.png"
                                            alt="Workshop Photo"
                                            width={2000}
                                            height={2000}
                                        />

                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-3">
                                <AccordionTrigger className="text-2xl font-[subheading-font] cursor-pointer">SOUTHEASTCON</AccordionTrigger>
                                <AccordionContent>
                                    <div className="text-[var(--ieee-bright-yellow)] text-lg font-[subheading-italic-font] py-2">

                                        IEEE UCF is an annual participant at SoutheastCon, the most influential IEEE Region 3 conference.
                                    </div>
                                    <div className="text-white text-lg font-[body-font] py-2">
                                        This conference, encompassing the southeastern United States and Jamaica, showcases the groundbreaking engineering and technical contributions made by both professionals and students. The next conference event will be held in 2026 from March 13 to March 15 in Huntsville, Alabama. Each year, IEEE UCF proudly represents our university by competing in a variety of challenges, including the Hardware Competition, Software Competition, Circuit Design Competition, Networking Competition, and more.
                                    </div>
                                    <div className="flex flex-row">
                                        <Image
                                            className="md:w-1/2 h-120 object-cover p-3 hover:scale-102 transition-transform"
                                            src="/southeastcon/secawards.png"
                                            alt="SEC Photo"
                                            width={2000}
                                            height={2000}
                                        />

                                        <Image
                                            className="md:w-1/2 h-120 object-cover p-3 hover:scale-102 transition-transform"
                                            src="/projects/sechardware1.png"
                                            alt="SEC Photo"
                                            width={2000}
                                            height={2000}
                                        />

                                    </div>
                                    <div className="text-white text-lg font-[body-font] py-2">
                                        This past 2025 SoutheastCon, IEEE UCF brought home several prestigious awards, earning 1st Place in the Hardware Design Competition, 2nd Place in the Hardware Competition, 1st Place in the Networking Competition (Janani Nagaraj), and 3rd Place in the Networking Competition (Rafael Puig). We are immensely proud of our chapter – not only for securing these remarkable achievements, but also for the invaluable technical expertise and personal growth they developed throughout the competitions.
                                    </div>  
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-4">
                                <AccordionTrigger className="text-2xl font-[subheading-font] cursor-pointer">COMMUNITY SERVICE</AccordionTrigger>
                                <AccordionContent>
                                    <div className="text-[var(--ieee-bright-yellow)] text-lg font-[subheading-italic-font] py-2">
                                        Community involvement is a core value for IEEE UCF.
                                    </div>  
                                    <div className="text-white text-lg font-[body-font] py-2">
                                        Our Service Committee enriches the entirety of Orlando, Florida by hosting events that share our passion for engineering and inspire others to explore its possibilities. We expose local elementary, middle, and high school students to electrical and computer engineering through volunteering at UCF&rsquo;s annual STEM Day, FIRST Robotics events, summer camps, and more. Additionally, we support local non-profits, like food pantries, through donations and volunteer work.
                                    </div>  
                                    <div className="flex flex-row">
                                        <Image
                                            className="md:w-1/2 h-120 object-cover p-3 hover:scale-102 transition-transform"
                                            src="/committees/service1.png"
                                            alt="Service Photo"
                                            width={2000}
                                            height={2000}
                                        />
                                        <Image
                                            className="md:w-1/2 h-120 object-cover p-3 hover:scale-102 transition-transform"
                                            src="/committees/service2.png"
                                            alt="Service Photo"
                                            width={2000}
                                            height={2000}
                                        />

                                    </div>
                                    
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-5">
                                <AccordionTrigger className="text-2xl font-[subheading-font] cursor-pointer">SOCIAL EVENTS</AccordionTrigger>
                                <AccordionContent>
                                    <div className="text-[var(--ieee-bright-yellow)] text-lg font-[subheading-italic-font] py-2">
                                        A highlight of IEEE UCF is the fun, connection-building social events.
                                    </div>  
                                    <div className="text-white text-lg font-[body-font] py-2">
                                        In-person and virtual events are hosted weekly by the Social Committee and allow for the club to build a community around itself. Throughout this past year, members have enjoyed grabbing bubble tea, ice skating, playing games at arcades, partaking in board games, rollerskating, playing golf, participating in board game competitions, and more. Many members can corroborate that they have developed incredible everlasting relationships through IEEE UCF.
                                    </div>
                                    <div className="flex flex-row">
                                        <Image
                                            className="md:w-1/2 h-120 object-cover p-3 hover:scale-102 transition-transform"
                                            src="/committees/social1.png"
                                            alt="Social Photo"
                                            width={2000}
                                            height={2000}
                                        />

                                        <Image
                                            className="md:w-1/2 h-120 object-cover p-3 hover:scale-102 transition-transform"
                                            src="/committees/social2.png"
                                            alt="Social Photo"
                                            width={2000}
                                            height={2000}
                                        />

                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-6">
                                <AccordionTrigger className="text-2xl font-[subheading-font] cursor-pointer">PROFESSIONAL DEVELOPMENT</AccordionTrigger>
                                <AccordionContent>
                                    <div className="text-[var(--ieee-bright-yellow)] text-lg font-[subheading-italic-font] py-2">
                                        Supporting members’ career advancement is critical for IEEE UCF.
                                    </div>  
                                     <div className="text-white text-lg font-[body-font] py-2">
                                        The Professional Development Committee is committed to equipping members with essential career-building strategies to enhance their marketability. Members have access to workshops on resumes, LinkedIn profiles, career fairs, and elevator pitch composition and additionally can participate in mentorship programs. Through partnerships with leading companies, IEEE UCF offers exclusive tours, information sessions, and frequent job opportunities, connecting members directly with potential employers.
                                    </div>  
                                    <div className="flex flex-row"> 
                                        <Image
                                        className="md:w-1/2 h-120 object- object-cover p-3 hover:scale-102 transition-transform"
                                        src="/committees/prodev2.png"
                                        alt="Pro Dev Photo"
                                        width={2000}
                                        height={2000}
                                        />

                                        <Image
                                            className="md:w-1/2 h-120 object- object-cover p-3 hover:scale-102 transition-transform"
                                            src="/committees/prodev1.png"
                                            alt="Pro Dev Photo"
                                            width={2000}
                                            height={2000}
                                        />
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-7">
                                <AccordionTrigger className="text-2xl font-[subheading-font] cursor-pointer">ALUMNI AND MEMBER NETWORK</AccordionTrigger>
                                <AccordionContent>
                                    <div className="text-[var(--ieee-bright-yellow)] text-lg font-[subheading-italic-font] py-2">
                                        IEEE UCF has an extensive network of engineering professionals at notable companies.
                                    </div>  
                                    <div className="flex flex-row">
                                        <Image
                                            className="w-full h-auto object- object-cover p-3 hover:scale-102 transition-transform"
                                            src="/sponsors/network.png"
                                            alt="About Us Photo"
                                            width={2000}
                                            height={2000}
                                        />
                                       
                                    </div>
                                </AccordionContent>
                            </AccordionItem>

                        </Accordion>
    </div>
    );

};