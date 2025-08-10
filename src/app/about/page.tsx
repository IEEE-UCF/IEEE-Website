"use client";
import { useState, useEffect } from "react";

import Image from "next/image";
import Link from "next/link";

import { SiLinkedin } from "react-icons/si";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { Card, CardContent } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

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
    const [isFlipped, setIsFlipped] = useState<boolean>(true);

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

                <div className="absolute top-0 left-0 w-full h-full animated-background bg-gradient-to-r   inset-0 items-center px-5 [background:radial-gradient(300%_125%_at_30%_0%,#0c0a09_10%,transparent_100%)] z-2"></div>

                <div className="flex flex-row my-10 p-40 justify-center absolute z-3 w-screen">
                    <div className="flex flex-col items-center justify-center self-center text-center gap-y-3 float">
                        <div className="font-[heading-font] text-[var(--ieee-bright-yellow)] text-6xl">WHAT IS IEEE?</div>
                        
                        <div className="text-white font-[body-font] text-3xl">ieee • /aɪ ˈtɹɪp.əl iː/ • institute of electrical and electronics engineers</div>

                        <div className="mt-[23vh]"></div>

                         <div className="relative group cursor-pointer">
                            <div className="absolute -inset-1 bg-gradient-to-r from-[var(--ieee-bright-yellow)] to-[var(--ieee-bright-yellow)] rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                            
                            <div className="group relative w-fit overflow-hidden rounded-2xl p-[2px] bg-transparent cursor-pointer transition-transform hover:scale-102">
                                <div className="animated-border pointer-events-none absolute inset-0 z-0 rounded-2xl bg-[conic-gradient(var(--ieee-bright-yellow)_20deg,transparent_120deg)] animate-spin-slow"></div>
                                
                                <button
                                className="relative z-10 w-195 h-50 p-5 rounded-2xl backdrop-blur-sm border border-white bg-[#0c0a09] text-white cursor-pointer"
                                onClick={() => setIsFlipped(!isFlipped)}
                                >
                                {isFlipped ? (
                                    <div>
                                    <div className="font-[subheading-italic-font] text-[var(--ieee-bright-yellow)] text-2xl">
                                        We are the innovators of tomorrow.
                                    </div>
                                    <div className="font-[body-font] text-xl">
                                        Located at the University of Central Florida, our IEEE student chapter is one of the largest in the nation and boasts over 300 active members. We foster technical experience through a collaborative environment, ultimately paving the way for successful careers in diverse engineering fields.
                                        
                                    </div>
                                    </div>
                                ) : (
                                    <div>
                                    <div className="font-[subheading-italic-font] text-2xl">Want to see our full story?</div>
                                    <div className="my-6"></div>
                                    <div className="place-self-center w-fit hover:scale-110 transition-transform hover:text-[var(--ieee-bright-yellow)] text-2xl font-[heading-font]">
                                        <div className="relative group cursor-pointer">
                                        <div className="absolute -inset-1 bg-gradient-to-r from-[var(--ieee-bright-yellow)] to-[var(--ieee-bright-yellow)] rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                                        <div className="relative px-8 py-7 bg-[#0c0a09] ring-1 ring-gray-900/5 rounded-lg leading-none flex items-top justify-start space-x-6">
                                            <div className="space-y-2">
                                            <Link href="https://www.youtube.com/watch?v=JyjVBBVm0g4">
                                                <p>WATCH VIDEO</p>
                                            </Link>
                                            </div>
                                        </div>
                                        </div>
                                    </div>
                                    </div>
                                )}
                                </button>
                            </div>
                            </div>


{/* non vibe coded version lol */}
{/* 
                        <button className="backdrop-blur-sm w-195 p-5 h-50 rounded-2xl border-1 border-white cursor-pointer hover:scale-102 transition-transform hover:opacity-80 opacity-100" onClick={() => setIsFlipped(!isFlipped)}>
                            
                            {isFlipped ? 
                                (<div className="text-white">
                                    <div className="font-[subheading-italic-font] text-[var(--ieee-bright-yellow)] text-2xl">We are the innovators of tomorrow.</div>
                                    <div className=" font-[body-font] text-xl">Located at the University of Central Florida, our IEEE student chapter is one of the largest in the nation and boasts over 300 active members. We foster technical experience through a collaborative environment, ultimately paving the way for successful careers in diverse engineering fields.</div>
                                </div>) 
                                : 
                                (<div className="">
                                    <div className="font-[subheading-italic-font] text-white text-2xl">Want to see our full story?</div>
                                    <div className="my-6"></div>
                                    <div className="place-self-center w-fit hover:scale-110 transition-transform hover:text-[var(--ieee-bright-yellow)] text-white text-2xl font-[heading-font]">
                                        <div className="relative group cursor-pointer">
                                        <div className="absolute -inset-1 bg-gradient-to-r from-[var(--ieee-bright-yellow)] to-[var(--ieee-bright-yellow)] rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                                    
                                        <div className="relative px-8 py-7 bg-[#0c0a09] ring-1 ring-gray-900/5 rounded-lg leading-none flex items-top justify-start space-x-6">
                                            <div className="space-y-2">
                                                <Link href = "https://www.youtube.com/watch?v=JyjVBBVm0g4">
                                                    <p className="">WATCH VIDEO</p>
                                                </Link>
                                            </div>
                                        </div>
                                    </div> 
                                    </div>
                                    
                                </div>)
                        
                            }
                            
                        </button> */}
                
                    </div>
                </div>

                <div className="bg-black h-full w-full">
                    <Image
                        className="absolute h-full w-full object-cover object-center z-0 opacity-100"
                        src="/SEC-Hardware.jpg"
                        alt="About Us Photo"
                        width={2000}
                        height={2000}
                    />
                </div>
                
            </div>

            <div className="flex flex-col w-full justify-center gap-x-3 bg-black">
                <div className="h-auto p-20 w-10/12 text-white place-self-center">
                {/* <div className="h-auto p-20 text-white w-1/2"> */}
                        <div className="font-[heading-font] text-[var(--ieee-bright-yellow)] text-4xl">IEEE UCF IN A NUTSHELL</div>
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
                                    <div className="text-white text-lg font-[subheading-font] py-2">
                                        Workshops and projects are premier opportunities for IEEE UCF members to advance their technical knowledge and experience.
                                    </div>
                                    <div className="text-white text-lg font-[body-font] py-2">
                                        The Workshop Committee offers specialized, expert-led sessions on topics such as circuit analysis, Verilog, soldering, wiring, microcontroller programming, and beyond. These workshops provide members with valuable technical skills often not introduced until later stages of their academic careers, giving them a significant early advantage. Additionally, IEEE UCF members have the opportunity to lead and participate in a variety of club-funded engineering projects – including the Internal Project Competition, Micromouse, and Guitar Hero. These projects enable members to apply their skills in real-world, collaborative environments while making impactful additions to their resumes.
                                    </div>
                                    <div className="flex flex-row">
                                        <Image
                                        className="w-1/2 h-120 object- object-cover p-3 hover:scale-102 transition-transform"
                                        src="/tech1.jpeg"
                                        alt="About Us Photo"
                                        width={2000}
                                        height={2000}
                                        />

                                        <Image
                                            className="w-1/2 h-120 object- object-cover p-3 hover:scale-102 transition-transform"
                                            src="/tech2.jpeg"
                                            alt="About Us Photo"
                                            width={2000}
                                            height={2000}
                                        />

                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-3">
                                <AccordionTrigger className="text-2xl font-[subheading-font] cursor-pointer">SOUTHEASTCON</AccordionTrigger>
                                <AccordionContent>
                                    <div className="text-white text-lg font-[subheading-font] py-2">
                                        IEEE UCF is an annual participant at SoutheastCon, the most influential IEEE Region 3 conference.
                                    </div>
                                    <div className="text-white text-lg font-[body-font] py-2">
                                        This conference, encompassing the southeastern United States and Jamaica, showcases the groundbreaking engineering and technical contributions made by both professionals and students. The next conference event will be held in 2026 from March 13 to March 15 in Huntsville, Alabama. Each year, IEEE UCF proudly represents our university by competing in a variety of challenges, including the Hardware Competition, Software Competition, Circuit Design Competition, Networking Competition, and more.
                                    </div>
                                    <div className="flex flex-row">
                                        <Image
                                            className="w-1/2 h-120 object- object-cover p-3 hover:scale-102 transition-transform"
                                            src="/everyonessodead.png"
                                            alt="About Us Photo"
                                            width={2000}
                                            height={2000}
                                        />

                                        <Image
                                            className="w-1/2 h-120 object- object-cover p-3 hover:scale-102 transition-transform"
                                            src="/aldemworking.png"
                                            alt="About Us Photo"
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
                                    <div className="text-white text-lg font-[subheading-font] py-2">
                                        Community involvement is a core value for IEEE UCF.
                                    </div>  
                                    <div className="text-white text-lg font-[body-font] py-2">
                                        Our Service Committee enriches the entirety of Orlando, Florida by hosting events that share our passion for engineering and inspire others to explore its possibilities. We expose local elementary, middle, and high school students to electrical and computer engineering through volunteering at UCF&rsquo;s annual STEM Day, FIRST Robotics events, summer camps, and more. Additionally, we support local non-profits, like food pantries, through donations and volunteer work.
                                    </div>  
                                    <div className="flex flex-row">
                                        <Image
                                            className="w-1/2 h-120 object- object-cover p-3 hover:scale-102 transition-transform"
                                            src="/service.jpeg"
                                            alt="About Us Photo"
                                            width={2000}
                                            height={2000}
                                        />

                                        <Image
                                            className="w-1/2 h-120 object- object-cover p-3 hover:scale-102 transition-transform"
                                            src="/service2.jpeg"
                                            alt="About Us Photo"
                                            width={2000}
                                            height={2000}
                                        />

                                    </div>
                                    
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-5">
                                <AccordionTrigger className="text-2xl font-[subheading-font] cursor-pointer">SOCIAL EVENTS</AccordionTrigger>
                                <AccordionContent>
                                    <div className="text-white text-lg font-[subheading-font] py-2">
                                        A highlight of IEEE UCF is the fun, connection-building social events.
                                    </div>  
                                    <div className="text-white text-lg font-[body-font] py-2">
                                        In-person and virtual events are hosted weekly by the Social Committee and allow for the club to build a community around itself. Throughout this past year, members have enjoyed grabbing bubble tea, ice skating, playing games at arcades, partaking in board games, rollerskating, playing golf, participating in board game competitions, and more. Many members can corroborate that they have developed incredible everlasting relationships through IEEE UCF.
                                    </div>
                                    <div className="flex flex-row flex-wrap">
                                        <Image
                                            className="w-1/2 h-120 object- object-cover p-3 hover:scale-102 transition-transform"
                                            src="/socials.jpg"
                                            alt="About Us Photo"
                                            width={2000}
                                            height={2000}
                                        />

                                        <Image
                                            className="w-1/2 h-120 object- object-cover p-3 hover:scale-102 transition-transform"
                                            src="/social2.jpeg"
                                            alt="About Us Photo"
                                            width={2000}
                                            height={2000}
                                        />

                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-6">
                                <AccordionTrigger className="text-2xl font-[subheading-font] cursor-pointer">PROFESSIONAL DEVELOPMENT</AccordionTrigger>
                                <AccordionContent>
                                    <div className="text-white text-lg font-[subheading-font] py-2">
                                        Supporting members’ career advancement is critical for IEEE UCF.
                                    </div>  
                                     <div className="text-white text-lg font-[body-font] py-2">
                                        The Professional Development Committee is committed to equipping members with essential career-building strategies to enhance their marketability. Members have access to workshops on resumes, LinkedIn profiles, career fairs, and elevator pitch composition and additionally can participate in mentorship programs. Through partnerships with leading companies, IEEE UCF offers exclusive tours, information sessions, and frequent job opportunities, connecting members directly with potential employers.
                                    </div>  
                                    <div className="flex flex-row">
                                        <Image
                                        className="w-1/2 h-120 object- object-cover p-3 hover:scale-102 transition-transform"
                                        src="/prodev.png"
                                        alt="About Us Photo"
                                        width={2000}
                                        height={2000}
                                        />

                                        <Image
                                            className="w-1/2 h-120 object- object-cover p-3 hover:scale-102 transition-transform"
                                            src="/mtronpti.png"
                                            alt="About Us Photo"
                                            width={2000}
                                            height={2000}
                                        />
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-7">
                                <AccordionTrigger className="text-2xl font-[subheading-font] cursor-pointer">ALUMNI AND MEMBER NETWORK</AccordionTrigger>
                                <AccordionContent>
                                    <div className="text-white text-lg font-[subheading-font] py-2">
                                        IEEE UCF has an extensive network of engineering professionals at notable companies.
                                    </div>  
                                    <div className="flex flex-row">
                                        <Image
                                            className="w-full h-auto object- object-cover p-3 hover:scale-102 transition-transform"
                                            src="/network.png"
                                            alt="About Us Photo"
                                            width={2000}
                                            height={2000}
                                        />
                                       
                                    </div>
                                </AccordionContent>
                            </AccordionItem>

                        </Accordion>
                </div>

                {/* rawdogging this linechart lol */}
                {/* it's fucking broken (never coding on an airplane again) */}
                {/* <Linechart/>  */}
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