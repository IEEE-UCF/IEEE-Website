"use client";
import Image from "next/image";
import Link from "next/link";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Timer } from "@/components/timer";
import { Calendar } from "@/components/calendar";
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


const carouselList = [
  { feature: "TECHNICAL WORKSHOPS", photo: "/workshopgif.gif" },
  { feature: "EMBEDDED PROJECTS", photo: "/techgif.gif" },
  { feature: "SOCIAL EVENTS", photo: "/socialgif.gif" },
  { feature: "CAREER DEVELOPMENT", photo: "/prodevgif.gif" },
  { feature: "COMMUNITY SERVICE", photo: "/servicegif.gif" },
];

export default function Home() {
  return (
    <div>
      <div className="flex flex-col max-w-screen overflow-x-hidden">
      
      {/* Hero Section */}
      <div className="relative w-full">
        {/* Background with gradient */}
        <div className="flex flex-col w-full relative 2xl:h-[140vh] h-[165vh] lg:h-[150vh] items-center [background:radial-gradient(125%_125%_at_50%_10%,#0c0a09_40%,#FFC72C_100%)]">
          <div className="px-5 w-full">
            <Navbar />

            {/* Hero Content */}
            <div className="flex flex-row gap-x-[3vw] justify-center self-center flex-wrap md:my-30 lg:my-0">
              {/* Left Side Text */}
              <div className="flex flex-col items-start text-center xl:text-left justify-center self-center">
                <div className="max-w-full my-8">
                  <div className="font-[display-font] text-[var(--ieee-bright-yellow)] text-[80px] lg:text-[120px]">
                    IEEE UCF
                  </div>
                  <div className="font-[subheading-font] text-white text-4xl lg:text-5xl">
                    STUDENT CHAPTER
                  </div>
                  <div className="text-white font-[body-italic-font] text-sm md:text-2xl lg:text-3xl my-3 flex flex-wrap w-fit">
                    <div className="typewriter flex flex-wrap whitespace-normal break-words">
                      From circuits to embedded systems, we engineer the future
                    </div>
                  </div>
                </div>

                {/* Learn More Button */}
                <div className="relative group cursor-pointer self-center xl:self-start">
                  <div className="absolute -inset-1 bg-gradient-to-r from-[var(--ieee-bright-yellow)] to-[var(--ieee-bright-yellow)] rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>

                  <div className="relative px-12 py-5 bg-[#0c0a09] ring-1 ring-gray-900/5 rounded-lg leading-none flex items-top justify-start space-x-6">
                    <div className="space-y-2">
                      <Link href="/about">
                        <p className="text-white text-3xl font-[subheading-italic-font]">
                          LEARN MORE
                        </p>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side Logo */}
              <div>
                <Image
                  className="object-contain float h-120 w-10/12 place-self-center"
                  src="/Logo-Landing.png"
                  alt="IEEE UCF Logo"
                  width={3000}
                  height={3000}
                />
              </div>
            </div>

            {/* Particle overlay */}
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
      </div>

      <div className="relative z-10 -translate-y-1/2 flex justify-center w-full">
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
    <div className="cursor-grab group relative w-full overflow-hidden rounded-2xl p-[4px] bg-transparent transition-transform hover:scale-102">
      
      {/* spinning background behind card */}
      <div
        className="animated-border absolute inset-0 p-20 rounded-2xl bg-[conic-gradient(var(--ieee-bright-yellow)_20deg,transparent_120deg)] transition-all duration-300 animate-spin -z-10"
        style={{ animationDuration: "6s" }}
      />

      {/* actual card on top */}
      <Card className="relative z-10 bg-black border-black w-65 h-90 sm:w-70 sm:h-70 md:h-85 md:w-85 xl:w-90 xl:h-90 transition shadow-md">
        <CardContent className="flex flex-col aspect-square justify-start">
          <Image
            className="object-cover w-auto h-64 sm:h-45 md:h-64 xl:h-70"
            src={item.photo}
            alt="Photo"
            width={2000}
            height={2000}
          />
          <span className="text-white text-xl font-[subheading-font] inline-flex align-middle place-items-center place-content-center place-self-center justify-center items-center justify-self-center self-center my-3">
            {item.feature}
          </span>
        </CardContent>
      </Card>
    </div>
  </div>
</CarouselItem>

              
            ))}
          </CarouselContent>
        </Carousel>
      </div>

      {/* Upcoming Events Section */}
      <div className="flex flex-col w-full p-5 bg-black -mt-20">
        <div className="font-[heading-font] text-[var(--ieee-bright-yellow)] text-7xl text-center my-5">
          UPCOMING EVENTS
        </div>

        <div>
        <div className="bg-black drop-shadow-lg p-5 m-4 rounded-lg flex flex-row items-center flex-wrap">
            <Timer />
            <Image
              className="object-cover h-80 md:h-70 lg:h-60 xl:h-53 rounded-md lg:w-7/12 w-full drop-shadow-lg"
              src="/gbmgif.gif"
              alt="IEEE Logo"
              width={2000}
              height={2000}
            />
          </div>

        <div className="flex flex-row p-5 m-4 bg-black rounded-lg flex-wrap md:flex-nowrap">
  {/* left box */}
  <div className="md:w-1/4 w-full h-120 bg-white drop-shadow-lg p-20 md:p-40 rounded-md md:mb-0"></div>

  {/* calendar */}
  <div className="md:w-3/4 w-full h-120 drop-shadow-lg rounded-md">
    <Calendar className="w-full h-full rounded-md" />
  </div>
</div>




        </div>
      </div>

      <Footer />
    </div>
    </div>
  );
}
