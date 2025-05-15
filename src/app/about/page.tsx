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
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
  
import { Bar, BarChart } from "recharts"
 
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"

import { ChartLegend, ChartLegendContent } from "@/components/ui/chart"

import { CartesianGrid, XAxis } from "recharts"

import { ChartTooltip } from "@/components/ui/chart"

import { type ChartConfig } from "@/components/ui/chart"

const chartConfig = {
  technical: {
    label: "Technical",
    color: "#FFD100",
  },
  interpersonal: {
    label: "Interpersonal",
    color: "#75787B",
  },
} satisfies ChartConfig


export default function About() {

    interface ChartData {
        month: keyof typeof monthOrder;
        technical: number;
        interpersonal: number;

    }
    
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

    const months = ['January', 'March', 'February', 'May', 'June','April'];

    const monthOrder = {
    January: 0,
    February: 1,
    March: 2,
    April: 3,
    May: 4,
    June: 5,
    July: 6,
    August: 7,
    September: 8,
    October: 9,
    November: 10,
    December: 11
    };

    const [chartData, setChartData] = useState<ChartData[]>([]);

    const [officers, setOfficers] = useState<Officer[]>([]);

    const [awards, setAwards] = useState<Award[]>([]);

    useEffect(() => {
        fetchOfficers();
        fetchChartData();
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

    const fetchChartData = async () => {
        const res = await fetch("/api/events", { method: "GET" });
        const events = await res.json();
      
        const groupedData: { [key: string]: { technical: number; interpersonal: number } } = {};
      
        events.data.forEach((event: any) => {
          const eventDate = new Date(event.time);
          const month = eventDate.toLocaleString("default", { month: "long" }); 
      
          if (!groupedData[month]) {
            groupedData[month] = { technical: 0, interpersonal: 0 };
          }
      
          if (event.type === "Technical") {
            groupedData[month].technical += 1;
          } else if (event.type === "Interpersonal") {
            groupedData[month].interpersonal += 1;
          }
        });
      
        const transformedData: ChartData[] = Object.keys(groupedData).map((month) => ({
          month: month as keyof typeof monthOrder,
          technical: groupedData[month].technical,
          interpersonal: groupedData[month].interpersonal,
        }));
        
        transformedData.sort((a, b) => {
            return monthOrder[a.month] - monthOrder[b.month];

        });

        setChartData(transformedData);
    };

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
                        <div className="font-[subheading-font] text-white text-xl w-3/4">Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.</div>
                        
                
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
                                <AccordionTrigger className="text-lg">AWARDS AND ACCOMPLISHMENTS</AccordionTrigger>
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
                                <AccordionTrigger className="text-lg">TECHNICAL DEVELOPMENT</AccordionTrigger>
                                <AccordionContent>
                                    Lorem ipsum dolor sit amet consectetur adipiscing elit. Amet consectetur adipiscing elit quisque faucibus ex sapien. Quisque faucibus ex sapien vitae pellentesque sem placerat. Vitae pellentesque sem placerat in id cursus mi.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-3">
                                <AccordionTrigger className="text-lg">SOUTHEASTCON HARDWARE TEAM</AccordionTrigger>
                                <AccordionContent>
                                    Lorem ipsum dolor sit amet consectetur adipiscing elit. Amet consectetur adipiscing elit quisque faucibus ex sapien. Quisque faucibus ex sapien vitae pellentesque sem placerat. Vitae pellentesque sem placerat in id cursus mi.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-4">
                                <AccordionTrigger className="text-lg">COMMUNITY SERVICE</AccordionTrigger>
                                <AccordionContent>
                                    Lorem ipsum dolor sit amet consectetur adipiscing elit. Amet consectetur adipiscing elit quisque faucibus ex sapien. Quisque faucibus ex sapien vitae pellentesque sem placerat. Vitae pellentesque sem placerat in id cursus mi.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-5">
                                <AccordionTrigger className="text-lg">SOCIAL EVENTS</AccordionTrigger>
                                <AccordionContent>
                                    Lorem ipsum dolor sit amet consectetur adipiscing elit. Amet consectetur adipiscing elit quisque faucibus ex sapien. Quisque faucibus ex sapien vitae pellentesque sem placerat. Vitae pellentesque sem placerat in id cursus mi.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-6">
                                <AccordionTrigger className="text-lg">PROFESSIONAL DEVELOPMENT</AccordionTrigger>
                                <AccordionContent>
                                    Lorem ipsum dolor sit amet consectetur adipiscing elit. Amet consectetur adipiscing elit quisque faucibus ex sapien. Quisque faucibus ex sapien vitae pellentesque sem placerat. Vitae pellentesque sem placerat in id cursus mi.
                                </AccordionContent>
                            </AccordionItem>

                        </Accordion>
                </div>
                
                <div className="flex flex-col p-20 text-white w-1/2 items-center align-middle justify-center">
                    <div className="font-[body-font] text-white text-lg">QUANTITY AND TYPE OF EVENTS (2024-2025)</div>
                    <ChartContainer config={chartConfig} className="h-[200px] w-full">
                    <BarChart accessibilityLayer data={chartData}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                        dataKey="month"
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                        tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <ChartLegend content={<ChartLegendContent />} />
                        <Bar dataKey="technical" fill="var(--color-technical)" radius={4} />
                        <Bar dataKey="interpersonal" fill="var(--color-interpersonal)" radius={4} />
                    </BarChart>
                    </ChartContainer>

                </div>

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