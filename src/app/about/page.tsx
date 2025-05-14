"use client";

import Image from "next/image";
import { Navbar } from "@/components/navbar";

import { useState, useEffect } from 'react';

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"

export default function About() {
    interface Officer {
        name: string;
    }

    const [officers, setOfficers] = useState<Officer[]>([]);

    useEffect(() => {
        fetchOfficers();

    }, []);

    const fetchOfficers = async () => {
        const res = await fetch("/api/officers");
        const officers = await res.json();
        setOfficers(officers.data);

    }

    return (
        <div className="flex flex-col">
            <Navbar/>

            <div className="">
                { officers.map((officer, index) => (
                    <div key={index} className="">

                        <Card className="w-50 h-50">
                            <CardContent className="flex aspect-square justify-center">
                                <span className="text-md font-[subheading-font] inline-flex">
                                    {officer.name}
                                    {/* add the rest later and get them to like update their info in the interface screaming crying */}
                                    {/* alsoooo make look pretty (: */}
                                </span>
                            </CardContent>
                        </Card>

                    </div>

                ))
                
                };
            </div>

        </div>
    );
};