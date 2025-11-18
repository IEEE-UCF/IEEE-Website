"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Timer } from "@/components/timer";

import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const carouselList = [
  { feature: "TECHNICAL WORKSHOPS", photo: "/committees/workshopgif.gif" },
  { feature: "EMBEDDED PROJECTS", photo: "/projects/sechardwaregif1.gif" },
  { feature: "SOCIAL EVENTS", photo: "/committees/socialgif1.gif" },
  { feature: "CAREER DEVELOPMENT", photo: "/committees/prodevgif.gif" },
  { feature: "COMMUNITY SERVICE", photo: "/committees/servicegif.gif" },
];

export default function Home() {
  const carouselRef = useRef(null);
  const eventsRef = useRef(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      gsap.fromTo(
        carouselRef.current,
        { opacity: 0, y: 100 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: carouselRef.current,
            start: "top 80%",
          },
        }
      );

      gsap.fromTo(
        eventsRef.current,
        { opacity: 0, y: 100 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: eventsRef.current,
            start: "top 85%",
          },
        }
      );
    }
  }, []);

  return (
    <div>
      <div className="flex flex-col max-w-screen overflow-x-hidden">
        <div className="relative w-full">
          <div className="flex flex-col w-full relative 2xl:h-[140vh] h-[165vh] lg:h-[150vh] items-center [background:radial-gradient(125%_125%_at_50%_10%,#0c0a09_40%,#FFC72C_100%)]">
            <div className="px-5 w-full">
              <Navbar />

              <div className="flex flex-row gap-x-[3vw] justify-center self-center flex-wrap md:my-30 lg:my-0 float">
                <div className="flex flex-col items-start text-center xl:text-left justify-center self-center">
                  <div className="max-w-full my-8">
                    <div className="font-[display-font] text-[var(--ieee-bright-yellow)] text-7xl lg:text-8xl">
                      IEEE @ UCF
                    </div>
                    <div className="font-[subheading-font] text-white text-4xl lg:text-5xl">
                      STUDENT CHAPTER
                    </div>
                    <div className="text-white font-[body-italic-font] text-sm md:text-xl lg:text-2xl my-3 flex flex-wrap w-fit">
                      <div className="typewriter flex flex-wrap whitespace-normal break-words">
                        From circuits to embedded systems, we engineer the future
                      </div>
                    </div>
                  </div>

                  <div className="relative group cursor-pointer self-center xl:self-start">
                    <div className="absolute -inset-1 bg-gradient-to-r from-[var(--ieee-bright-yellow)] to-[var(--ieee-bright-yellow)]  blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>

                    <div className="relative px-12 py-5 bg-[#0c0a09] ring-1 rounded-sm ring-gray-900/5 leading-none flex items-top justify-start space-x-6">
                      <div className="space-y-2">
                        <Link href="/about">
                          <p className="text-white text-xl font-[body-italic-font]">
                            LEARN MORE!
                          </p>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <Image
                    className="object-contain mt-10 h-60 w-auto lg:h-110 lg:w-9/12 place-self-center"
                    src="/iconography/ieeeucfsymbol.png"
                    alt="IEEE UCF Logo"
                    width={3000}
                    height={3000}
                  />
                </div>
              </div>

              <div className="absolute w-full left-0 particles-container">
                <div className="particle"></div>
                <div className="particle"></div>
                <div className="particle"></div>
                <div className="particle"></div>
                <div className="particle"></div>
                <div className="particle"></div>
              </div>
            </div>
            
          </div>
      <div className="relative -translate-y-20 w-full overflow-hidden leading-none">
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 1200 120"
    preserveAspectRatio="none"
    className="w-full h-20"
  >
    <defs>
      <radialGradient id="bg-gradient" cx="40%" cy="120%" r="125%">
        <stop offset="50%" stopColor="#000000" />
        <stop offset="100%" stopColor="#3d3110" />
      </radialGradient>
    </defs>

    <path
      d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86, 82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53, 26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
      fill="url(#bg-gradient)"
      transform="scale(1,-1) translate(0,-120)" 
    />
  </svg>
</div>

          
        </div>



        
        
      
        
        <div className="[background:radial-gradient(125%_125%_at_50%_10%,#3d3110_40%,#000000_100%)] -translate-y-20 ">

        <div
          ref={carouselRef}
          className="relative z-10 -translate-y-1/2 flex justify-center w-full"
        >
          <Carousel
            opts={{ align: "center" }}
            plugins={[Autoplay({ delay: 2000 })]}
            className="w-3/4"
          >
            <CarouselContent>
              {carouselList.map((item, index) => (
                <CarouselItem
                  key={index}
                  className="flex basis-xs md:basis-3/5 lg:basis-5/11 xl:basis-5/12 2xl:basis-1/3 justify-center items-center cursor-grab py-3"
                >
                  <div className="p-2">
                    <div className="cursor-grab group relative w-full overflow-hidden p-[3px] bg-transparent transition-transform hover:scale-102 rounded-sm">
                      <div
                        className="animated-border absolute inset-0 p-20 bg-[conic-gradient(var(--ieee-bright-yellow)_20deg,transparent_120deg)] transition-all duration-300 animate-spin -z-10 rounded-sm"
                        style={{ animationDuration: "6s" }}
                      />
                      <Card className="relative z-10 p-0 rounded-sm border-none w-65 h-90 sm:w-70 sm:h-70 md:h-85 md:w-85 xl:w-90 xl:h-90 transition shadow-md overflow-hidden group">
                        <CardContent className="flex flex-col justify-end h-full w-full p-0 ">
                          <div className="relative h-full w-full">
                            <Image
                              src={item.photo}
                              alt="Photo"
                              fill
                              className="object-cover object-bottom rounded-none"
                              priority
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                            <span className="absolute w-full h-fit bottom-0 left-1/2 -translate-x-1/2 p-2 text-white text-lg font-[body-font] bg-black/60 ">
                              {item.feature}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>

        </div>

        <div className="relative -translate-y-40 w-full overflow-hidden leading-none">
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 1200 120"
    preserveAspectRatio="none"
    className="w-full h-20"
  >
    <defs>
      <radialGradient id="bg-gradient2" cx="40%" cy="110%" r="125%">
        <stop offset="50%" stopColor="#000000" />
        <stop offset="100%" stopColor="#0d0a03" />
      </radialGradient>
    </defs>

    <path
      d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86, 82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53, 26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
      fill="url(#bg-gradient2)"
      transform="scale(1,-1) translate(0,-120)" 
    />
  </svg>
</div>


        <div
          className="flex flex-col w-full p-5 bg-[#0d0a03] -mt-40"
        >
          <div className="font-[heading-font] text-[var(--ieee-bright-yellow)] text-5xl lg:text-6xl text-center my-5">
            UPCOMING EVENTS
          </div>

          <div
          ref={eventsRef}>
            
            <div className="p-1 sm:p-9 flex flex-row items-center flex-wrap">
              <Timer />
            </div>

            
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
}
