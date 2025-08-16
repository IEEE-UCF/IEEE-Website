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
} from "@/components/ui/carousel"
import {
  Card,
  CardContent,
} from "@/components/ui/card"

const carouselList = [
  {
    feature: "TECHNICAL WORKSHOPS",
    photo: "/workshopgif.gif",
  },
  
  {
    feature: "EMBEDDED PROJECTS",
    photo: "/techgif.gif",
  },

  {
    feature: "SOCIAL EVENTS",
    photo: "/socialgif.gif",
  },
  
  {
    feature: "CAREER DEVELOPMENT",
    photo: "/prodevgif.gif",
  },

  {
    feature: "COMMUNITY SERVICE",
    photo: "/servicegif.gif",
  }
];

export default function Home() {
  return (
    <div className="flex flex-col max-w-screen overflow-hidden">
      <div className="flex flex-col w-full animated-background bg-gradient-to-r  absolute inset-0 -z-10 h-[140vh] items-center [background:radial-gradient(125%_125%_at_50%_10%,#0c0a09_40%,#FFC72C_100%)]">
        
        <div className="px-5 w-full">
          <Navbar/>
          
          <div className="flex flex-row gap-x-[3vw] justify-center self-center flex-wrap">

            <div className="flex flex-col items-start text-center xl:text-left justify-center self-center float">
              <div className="max-w-full my-8">
                <div className="font-[display-font] text-[var(--ieee-bright-yellow)] text-[80px] lg:text-[120px]">IEEE UCF</div>
                <div className="font-[subheading-font] text-white text-4xl lg:text-5xl">STUDENT CHAPTER</div>
                <div className=" text-white font-[body-italic-font] text-xl md:text-2xl lg:text-3xl my-3 flex flex-wrap w-fit">
                <div className="typewriter flex flex-wrap  whitespace-normal break-words">
                  From circuits to embedded systems, we engineer the future
                </div>
              </div>

              </div>

              <div className="relative group cursor-pointer self-center xl:self-start">
                  <div className="absolute -inset-1 bg-gradient-to-r from-[var(--ieee-bright-yellow)] to-[var(--ieee-bright-yellow)] rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                  
                  <div className="relative px-12 py-5 bg-[#0c0a09] ring-1 ring-gray-900/5 rounded-lg leading-none flex items-top justify-start space-x-6">
                    <div className="space-y-2">
                        <Link href = "/about">
                          <p className="text-white text-3xl font-[subheading-italic-font]">LEARN MORE</p>
                        </Link>
                    </div>
                  </div>
              </div>

            </div>
            <div className="">
            <Image 
              className="object-contain float h-120 w-10/12 place-self-center" 
              src="/Logo-Landing.png" 
              alt="IEEE UCF Logo" 
              width={3000} 
              height={3000} 
            />
            </div>

          </div>

          <div className="absolute particles-container">
              <div className="particle"></div>
              <div className="particle"></div>
              <div className="particle"></div>
              <div className="particle"></div>
              <div className="particle"></div>
              <div className="particle"></div>
          </div>
    
        </div>

        <div className="absolute top-full -translate-y-2/4 w-full flex justify-center items-center h-fit">

          <Carousel
            opts={{
              align: "center",
            }}
            plugins={[
              Autoplay({
                delay: 2000,
              }),
            ]}
            className="w-3/4"
          >
            <CarouselContent>
              {carouselList.map((item, index) => (
                <CarouselItem key={index} className="flex md:basis-1/2 lg:basis-1/3 justify-center items-center cursor-grab py-3">
                  <div className="p-2">
                    <Card className="w-85 h-85 hover:scale-102 transition shadow-md">
                      <CardContent className="flex flex-col aspect-square justify-start">
                        <Image 
                          className="object-cover w-auto h-64" 
                          src={item.photo}
                          alt="Photo" 
                          width={2000} 
                          height={2000} 
                                                                                
                        />
                        <span className="text-xl font-[body-font] inline-flex self-center my-3">
                          {item.feature}
                        </span>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>

        </div>

        {/* todo add flyer and gbm stuff */}


        <div className="flex flex-col w-full p-5">
          <div className="font-[heading-font] text-[var(--ieee-bright-yellow)] text-7xl text-center my-5">UPCOMING EVENTS</div>

          <div className="">

            <div className="bg-white drop-shadow-lg p-5 gap-x-5 m-4 rounded-lg flex flex-row items-center">
              <Timer/>
                <Image 
                className="object-cover h-53 rounded-lg w-3/4 drop-shadow-lg " 
                src="/gbmgif.gif" 
                alt="IEEE Logo" 
                width={2000} 
                height={2000} 
              
              />

            </div>

            <div className="flex flex-row">
              <div className="bg-white drop-shadow-lg p-40 py-60 m-4 rounded-lg">
              </div>
              <div className="bg-white drop-shadow-lg w-full m-4 rounded-lg">
                 <Calendar className="w-full h-full p-4"/>
              </div>


            </div>

          </div>

        </div>
        <Footer/>


      </div>

    </div>

  );
}
