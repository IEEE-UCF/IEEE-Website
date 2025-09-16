"use client";
import { useState, useEffect, useRef } from "react";
import { SiLinkedin } from "react-icons/si";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

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

export default function AboutOfficers() {
  const [officers, setOfficers] = useState<Officer[]>([]);
  const executiveRef = useRef<HTMLDivElement | null>(null);
  const chairRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    fetchOfficers();
  }, []);

  useEffect(() => {
    const animateRows = (containerRef: React.RefObject<HTMLDivElement | null>) => {
      if (!containerRef.current) return;
      const rows = containerRef.current.querySelectorAll(".officer-row");
      rows.forEach((row) => {
        gsap.fromTo(
          row,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: row,
              start: "top 70%",
            },
          }
        );
      });
    };

    animateRows(executiveRef);
    animateRows(chairRef);
  }, [officers]);

  const fetchOfficers = async () => {
    const res = await fetch("/api/officers", { method: "GET" });
    const data = await res.json();
    setOfficers(data.data);
  };

  const groupOfficers = (officersList: Officer[], perRow = 4) => {
    const rows: Officer[][] = [];
    for (let i = 0; i < officersList.length; i += perRow) {
      rows.push(officersList.slice(i, i + perRow));
    }
    return rows;
  };

  const renderOfficerCard = (officer: Officer, index: number) => (
    <div key={index} className="w-70 h-110 m-2 relative rounded-sm border-1 border-white overflow-hidden shadow-lg transition-transform hover:scale-102">
      <Image
        src={officer.photo}
        alt={officer.name}
        fill
        className="object-cover"
      />

      <div className="absolute inset-0 hover:bg-black/0 transition-colors bg-black/40 flex flex-col justify-end p-4 text-white ">
        <span className="text-xl font-[heading-font]">{officer.name.toUpperCase()}</span>
        <span className="text-md font-[heading-font]">{officer.role.toUpperCase()}</span>
        <span className="text-sm font-[body-font]">{officer.year}</span>
        <span className="text-sm font-[body-font]">{officer.major}</span>
        <Link href={officer.linkedin} className="mt-2 inline-block">
          <SiLinkedin size={25} color="white" />
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

  return (
    <div className="flex flex-col items-center justify-center p-10 w-full gap-10">
      <div className="">
        <div className="text-center text-white font-[heading-font] text-3xl my-5">EXECUTIVE BOARD</div>
        <div ref={executiveRef} className="flex flex-col w-full gap-4">
          {renderRows(officers.filter((officer) => officer.type === "Executive"))}
        </div>
      </div>

      <div className="">
        <div className="text-center text-white font-[heading-font] text-3xl my-5">CHAIRS</div>
        <div ref={chairRef} className="flex flex-col w-full gap-4">
          {renderRows(officers.filter((officer) => officer.type === "Chair"))}
        </div>
      </div>
    </div>
  );
}
