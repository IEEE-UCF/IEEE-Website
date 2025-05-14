import Image from "next/image";
import { Navbar } from "@/components/navbar";

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
    // src: "",
  },
  
  {
    feature: "EMBEDDED HARDWARE PROJECTS",
    // src: "",
  },

  {
    feature: "SOCIAL EVENTS",
    // src: "",
  },
  
  {
    feature: "PROFESSIONAL DEVELOPMENT WORKSHOPS",
    // src: "",
  },

  {
    feature: "COMMUNITY SERVICE EVENTS",
    // src: "",
  }

]

export default function Home() {
  return (
    <div className="flex flex-col">
      <div className="flex flex-col w-screen animated-background bg-gradient-to-r  absolute inset-0 -z-10 h-screen  items-center px-5 [background:radial-gradient(125%_125%_at_50%_10%,#0c0a09_40%,#FFD100_100%)]">
        <Navbar/>
        
        <div className="flex flex-row gap-x-[10vw] p-20">
          <div className="flex flex-col items-start justify-start">

            <div className="font-[heading-font] text-[var(--ieee-bright-yellow)] text-9xl">IEEE UCF</div>
            <div className="font-[body-font] text-white text-6xl">STUDENT CHAPTER</div>
            <div className="text-white font-[subheading-font] text-2xl my-5">mission statement :D</div>

            <div className="relative group cursor-pointer">
                <div className="absolute -inset-1 bg-gradient-to-r from-[var(--ieee-bright-yellow)] to-[var(--ieee-bright-yellow)] rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                
                <div className="relative px-7 py-6 bg-[#0c0a09] ring-1 ring-gray-900/5 rounded-lg leading-none flex items-top justify-start space-x-6">
                  <div className="space-y-2">
                      <p className="text-white text-xl font-[heading-font]">LEARN MORE</p>
                  </div>
                </div>
            </div>

          </div>

          <div className="">
            {/* replace bc ucf no like pegasus */}
            <Image 
              className="object-contain w-90" 
              src="/IEEE-Pegasus-Icon.png" 
              alt="IEEE Logo" 
              width={2000} 
              height={2000} 
            
            />


          </div>

        </div>

        <div className="absolute top-full -translate-y-1/2 w-full flex justify-center">

        <Carousel
          opts={{
            align: "start",
          }}
          className="w-1/2"
        >
          <CarouselContent>
            {carouselList.map((item, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                <div className="p-1">
                  <Card className="w-50 h-50">
                    <CardContent className="flex aspect-square justify-center">
                      <span className="text-md font-[subheading-font] inline-flex">
                        {item.feature}
                        {/* img pulled from arr */}
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

        <div className="my-52"></div>

        <div className="flex flex-col w-10/12">
          <div className="font-[body-font] text-[var(--ieee-bright-yellow)] text-6xl text-center my-10">UPCOMING EVENTS</div>

          <div className="">

            <div className="bg-white drop-shadow-lg p-40 m-4 rounded-3xl"></div>

            <div className="flex flex-row">
              <div className="bg-white drop-shadow-lg p-40 py-60 m-4 rounded-3xl"></div>
              <div className="bg-white drop-shadow-lg w-full m-4 rounded-3xl">
                 <Calendar className="w-full h-full p-4"/>
              </div>


            </div>

          </div>

        </div>

      </div>
    </div>

  );
}
