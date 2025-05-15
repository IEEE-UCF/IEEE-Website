import Image from "next/image";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import Link from "next/link";

import { Timer } from "@/components/timer";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Calendar } from "@/components/calendar";

// maybe db push this all rather than arrays but then again im lazy and what isn't broke we don't fix

const carouselList = [
  {
    feature: "TECHNICAL WORKSHOPS",
    photo: "/larry.png",
  },
  
  {
    feature: "EMBEDDED HARDWARE PROJECTS",
    photo: "/larry.png",
  },

  {
    feature: "SOCIAL EVENTS",
    photo: "/larry.png",
  },
  
  {
    feature: "PROFESSIONAL DEVELOPMENT WORKSHOPS",
    photo: "/larry.png",
  },

  {
    feature: "COMMUNITY SERVICE EVENTS",
    photo: "/larry.png",
  }

]

export default function Home() {
  return (
    <div className="flex flex-col max-w-screen overflow-hidden">
      <div className="flex flex-col w-full animated-background bg-gradient-to-r  absolute inset-0 -z-10 h-[120vh] items-center [background:radial-gradient(125%_125%_at_50%_10%,#0c0a09_40%,#FFC72C_100%)]">
        <div className="px-5">
          <Navbar/>
          
          <div className="flex flex-row gap-x-[10vw] p-20">
            <div className="flex flex-col items-start justify-start">

              <div className="font-[heading-font] text-[var(--ieee-bright-yellow)] text-9xl">IEEE UCF</div>
              <div className="font-[body-font] text-white text-6xl">STUDENT CHAPTER</div>
              <div className="text-white font-[subheading-font] text-2xl my-5">Lorem ipsum dolor sit amet consectetur adipiscing elit. Dolor sit amet consectetur adipiscing elit quisque faucibus.</div>

              <div className="relative group cursor-pointer">
                  <div className="absolute -inset-1 bg-gradient-to-r from-[var(--ieee-bright-yellow)] to-[var(--ieee-bright-yellow)] rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                  
                  <div className="relative px-7 py-6 bg-[#0c0a09] ring-1 ring-gray-900/5 rounded-lg leading-none flex items-top justify-start space-x-6">
                    <div className="space-y-2">
                        <Link href = "/about">
                          <p className="text-white text-xl font-[heading-font]">LEARN MORE</p>
                        </Link>
                    </div>
                  </div>
              </div>

            </div>

            <div className="">
              {/* replace bc ucf no like pegasus */}
              <Image 
                className="object-contain w-120" 
                src="/IEEE-Pegasus-Icon.png" 
                alt="IEEE Logo" 
                width={2000} 
                height={2000} 
              
              />


            </div>

          </div>
        </div>


        <div className="absolute top-full -translate-y-2/4 w-full flex justify-center items-center h-fit">

        <Carousel
          opts={{
            align: "center",
          }}
          className="w-3/4"
        >
          <CarouselContent>
            {carouselList.map((item, index) => (
              <CarouselItem key={index} className="flex md:basis-1/2 lg:basis-1/3 justify-center items-center">
                <div className="p-1">
                  <Card className="w-70 h-70">
                    <CardContent className="flex flex-col aspect-square justify-start">
                      <Image 
                        className="object-cover w-fit h-fit" 
                        src={item.photo}
                        alt="Photo" 
                        width={2000} 
                        height={2000} 
                                                                              
                      />
                      <span className="text-sm justify-left text-left font-[subheading-font] inline-flex my-2">
                        {item.feature}
                      </span>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>


          
        </div>

        {/* add flyer and gbm stuff */}

        <div className="my-64"></div>

        <div className="flex flex-col w-full p-5">
          <div className="font-[body-font] text-[var(--ieee-bright-yellow)] text-6xl text-center my-5">UPCOMING EVENTS</div>

          <div className="">

            <div className="bg-white drop-shadow-lg p-10 gap-x-10 m-4 rounded-lg flex flex-row items-center">
              <Timer/>
                <Image 
                className="object-cover h-53 rounded-lg w-3/4 drop-shadow-lg " 
                src="/larry.png" 
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
