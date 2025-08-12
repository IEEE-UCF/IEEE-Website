"use client";


import Image from "next/image";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

import { useEffect, useState } from "react";
import { MapPin } from "lucide-react"
import { Calendar1 } from "lucide-react"


interface EventData {
  _id: string; 
  committee: string;
  title: string;
  time: Date;
  address: string;
  description: string;
  flyer: string;
  rsvp?: string;
  photos?: {
    type?: string;
    [key: string]: unknown; 
  };
}

export default function EventsPage() { 

    /*
    struct for the event
    hash table with 12 spots for each month
    each spot is a linked list 
    */

    interface Event {
        eventName: string;
        eventDate: string;
        eventDesc: string;
        eventAddress: string;
        eventCommittee: string;
        eventFlyer: string;
    
    }

    const [eventData, setEventData] = useState<Event[][]>([]);

    const monthNames = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
    ];

    const currentMonthName = monthNames[new Date().getMonth()];
    const [currentMonth] = useState(currentMonthName);

    const [currentEvent, setCurrentEvent] = useState<Event | null>(null);

    useEffect( () => {
        fetchTimelineData();
    
    }, []);

    const fetchTimelineData = async () => {
        const res = await fetch("/api/events", {method: "GET"});

        const events = await res.json();
        const eventHashTable: Event[][] = Array.from({length: 12}, () => []);

        events.data.forEach((event: EventData) => {
            const eventDate = new Date(event.time);

            const currentMonth = (new Date()).getMonth();
            const eventMonth = eventDate.getMonth();

            const newDate = eventDate.toLocaleString("default", {month: "long", day: "numeric", hour: "numeric", minute: "numeric"});

            
            const newEvent: Event = {
                eventName: event.title,
                eventDate: newDate,
                eventDesc: event.description,
                eventAddress: event.address,
                eventCommittee: event.committee,
                eventFlyer: event.flyer
            }

            if(eventMonth>=currentMonth) {
                eventHashTable[eventMonth].push(newEvent);

            }

        });

        setEventData(eventHashTable);
      };

    return (
        <div className="flex flex-col max-w-screen overflow-hidden">

            <div className="relative w-full h-[120vh]">
                
                <div className="absolute z-4 w-full h-fit inset-0 items-center px-5">
                    <Navbar />

                </div>

                <div className="absolute top-0 left-0 w-full h-full animated-background bg-gradient-to-r   inset-0 items-center px-5 [background:radial-gradient(125%_125%_at_50%_10%,#0c0a09_5%,transparent_100%)] z-2"></div>

                <div className="flex flex-row my-30 p-40 justify-end absolute z-3 w-screen">
                    <div className="flex flex-col items-end justify-end self-end text-right gap-y-5 float">
                        <div className="font-[heading-font] text-[var(--ieee-bright-yellow)] text-6xl">UPCOMING EVENTS</div>
                        <div className="font-[body-font] text-white text-2xl w-3/4">
                            Experience IEEE UCF&rsquo;s exciting lineup of events this
                            <span className="font-[subheading-font] text-[var(--ieee-bright-yellow)]"> {currentMonth} </span>
                            and beyond. From technical workshops to career-building sessions to social gatherings to community service opportunities, there is unlimited opportunity to expand networks and grow skills.
                        </div>
                       
                
                    </div>
                </div>
                
                <div className="bg-black h-full w-full">
                    <Image
                        className="absolute h-full w-full object-cover z-0 opacity-70"
                        src="/gbmgif.gif"
                        alt="Events Photo"
                        width={2000}
                        height={2000}
                    />

                </div>
                
                
            </div>

            
            
            {/* workshops lmao */}
            <div className="bg-black w-full h-screen flex flex-col p-10 items-center">
                {/* <Sidebar/> */}
                <div className="flex flex-row h-[400]">
                    <div className="flex w-3/4">
                            {currentEvent ? (
                                <div className="flex flex-col">
                                    <Image
                                        className="object-cover rounded-3xl w-screen"
                                        src={currentEvent.eventFlyer ? currentEvent.eventFlyer : "/larry.png"}
                                        alt="Photo"
                                        width={2000}
                                        height={2000}
                                    />
                                    <div className="m-5 flex flex-col gap-y-3">
                                        <div className="font-bold text-3xl text-white">
                                            {currentEvent.eventName}
                                        </div>
                                         <div className="text-xl text-white">
                                            {currentEvent.eventDesc}
                                        </div>

                                        <div className="flex flex-row justify-between ">
                                            <div className="flex text-lg flex-row gap-x-2 text-white">
                                                <Calendar1 />
                                                {currentEvent.eventDate}
                                            </div>
                                            <div className="flex text-lg flex-row gap-x-2 text-white">
                                                <MapPin />
                                                {currentEvent.eventAddress}
                                            </div>
                                        </div>

                                       
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full w-1/4">
                                    {eventData.length > 0 && eventData.some(month => month.length > 0) ? (
                                        <div className="">
                                            {(() => {
                                                const firstEvent = eventData.flat().find(Boolean);
                                                if (firstEvent) {
                                                    setCurrentEvent(firstEvent);
                                                    return null;
                                                }
                                                return <span>No event selected.</span>;
                                            })()}
                                        </div>
                                    ) : (
                                        <span>No event selected.</span>
                                    )}
                                </div>
                                )
                            }
                    </div>
                    
                    
                    <div className="flex flex-col max-h-200 overflow-y-auto p-6">
                        {eventData.map((monthEvents, monthIdx) =>
                            monthEvents.map((item, itemIdx) => (
                            <div
                                className="hover:scale-102 transition hover:opacity-80 hover:z-100"
                                key={`${monthIdx}-${itemIdx}-${item.eventName}`}
                            >
                                <div
                                className="group relative w-fit overflow-hidden rounded-2xl p-[2px] bg-transparent cursor-pointer transition-transform hover:scale-102"
                                onMouseEnter={(e) => {
                                    const el = e.currentTarget.querySelector<HTMLDivElement>('.animated-border');
                                    if (el) el.style.animationPlayState = 'running';
                                }}
                                onMouseLeave={(e) => {
                                    const el = e.currentTarget.querySelector<HTMLDivElement>('.animated-border');
                                    if (el) el.style.animationPlayState = 'paused';
                                }}
                                >
                                <div
                                    className="animated-border pointer-events-none absolute inset-0 z-0 rounded-2xl bg-[conic-gradient(var(--ieee-bright-yellow)_20deg,transparent_120deg)] opacity-0 scale-95 transition-all duration-300 group-hover:opacity-100 group-hover:scale-100 animate-spin"
                                    style={{ animationPlayState: 'paused', animationDuration: '6s' }}
                                />

                                <button
                                    onClick={() => setCurrentEvent(item)}
                                    className="relative z-10 flex flex-row p-3 cursor-pointer bg-black rounded-2xl m-0.5"
                                >
                                    <Image
                                    className="object-cover rounded-2xl w-60 h-60"
                                    src={item.eventFlyer ? item.eventFlyer : "/larry.png"}
                                    alt="Photo"
                                    width={2000}
                                    height={2000}
                                    />

                                    <div className="m-5 flex flex-col justify-center">
                                    <div className="flex flex-col justify-between gap-y-2">
                                        <div className="text-left font-bold text-lg text-white">
                                        {item.eventName}
                                        </div>
                                        <div className="flex text-left gap-x-2 text-md text-white">
                                        {item.eventDate}
                                        </div>
                                        <div className="flex text-left text-md text-white">
                                        {item.eventAddress}
                                        </div>
                                    </div>
                                    </div>
                                </button>
                                </div>
                            </div>
                            ))
                        )}
                        </div>

                </div>

            </div>

            <Footer/>

        </div>


    );

}
