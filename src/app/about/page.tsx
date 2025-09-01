import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";

import { Metadata } from "next";

import AboutHeader from "@/components/pg/aboutheader";
import AboutIEEE from "@/components/pg/aboutieee";
import AboutOfficers from "@/components/pg/aboutofficers";

const pageTitle = "About | IEEE UCF";
const pageDescription = "IEEE UCF is one of the largest IEEE student chapters in the nation, fostering collaboration, technical growth, and career success for over 300 members in diverse engineering fields.";

export const metadata: Metadata = {
    title: pageTitle,
    description: pageDescription,
    openGraph: {
        title: pageTitle,
        description: pageDescription,
        url: "https://www.ieeeucf.com/about",
        type: "website"
    }
};

export default function About() {
    

    return (
        <div className="flex flex-col max-w-screen overflow-hidden">
            <div className="relative w-full h-[120vh]">
                <div className="absolute z-4 w-full h-fit inset-0 items-center px-5">
                    <Navbar />
                </div>


                <AboutHeader/>
                
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
        <stop offset="100%" stopColor="#000000" />
      </radialGradient>
    </defs>

    <path
      d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86, 82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53, 26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
      fill="url(#bg-gradient)"
      transform="scale(1,-1) translate(0,-120)" 
    />
  </svg>
</div>
            <div className="flex -translate-y-20  flex-col w-full justify-center gap-x-3 bg-black">
                <div className="h-auto p-10 sm:p-20 sm:w-10/12 text-white place-self-center">
                        <div className="font-[heading-font] text-[var(--ieee-bright-yellow)] text-4xl">IEEE UCF IN A NUTSHELL</div>
                        <AboutIEEE/>
                </div>

                <div className="p-"></div>

            </div>
             <div className="relative -translate-y-40 w-full overflow-hidden leading-none">
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 1200 120"
    preserveAspectRatio="none"
    className="w-full h-20"
  >
    <defs>
      <radialGradient id="bg-gradient3" cx="40%" cy="120%" r="125%">
        <stop offset="50%" stopColor="#262522" />
        <stop offset="100%" stopColor="#262522" />
      </radialGradient>
    </defs>

    <path
      d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86, 82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53, 26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
      fill="url(#bg-gradient3)"
      transform="scale(1,-1) translate(0,-120)"
    />
  </svg>
</div>
<div className="bg-[#262522] -translate-y-40 ">
            <AboutOfficers/>
            </div>
            <div className="-mt-40">
  <Footer />
</div>



        </div>
    );
};