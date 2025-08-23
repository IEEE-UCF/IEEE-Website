import Image from "next/image";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

type MailToProps = {
    email: string;
    subject?: string;
    body?: string;
    children?: React.ReactNode;
};

const MailTo: React.FC<MailToProps> = ({ email, subject = "", body = "", children }) => {
    return (
        <a href={`mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`}>
            {children}
        </a>
    );
};

// finish this later
// const ContactUs = () => {
//     return (
//         <form onSubmit={} >


//         </div>

//     );

// }

export default function SponsorshipsPage() { 
    // const [contactUsForm, setContactForm] = useState(false);

    return(
        <div className="flex flex-col max-w-screen overflow-hidden">
            <div className="relative w-full h-[120vh]">
                
                <div className="absolute z-4 w-full h-fit inset-0 items-center px-5">
                    <Navbar />

                </div>

                <div className="absolute top-0 left-0 w-full h-full animated-background bg-gradient-to-r   inset-0 items-center px-5 [background:radial-gradient(125%_125%_at_50%_10%,#0c0a09_5%,transparent_100%)] z-2"></div>

                <div className="flex flex-row my-20 p-40 justify-center absolute z-3 w-screen">
                    <div className="flex flex-col items-center justify-center self-center text-center gap-y-5 float">
                        <div className="font-[heading-font] text-[var(--ieee-bright-yellow)] text-5xl sm:text-6xl">SPONSORSHIPS</div>
                        <div className="font-[body-font] text-white text-xl lg:text-2xl w-3/4">
                        Without sponsors, nothing would be possible for IEEE UCF. To inquire about supporting IEEE UCF, view the sponsorship package below or click the button to send a direct email.
                        </div>

                        <div className="relative group cursor-pointer">
                            <div className="absolute -inset-1 bg-gradient-to-r from-[var(--ieee-bright-yellow)] to-[var(--ieee-bright-yellow)] rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                                    
                            <div className="relative px-10 py-7 bg-[#0c0a09] ring-1 ring-gray-900/5 rounded-lg leading-none flex items-top justify-start space-x-6">
                                <div className="space-y-2 text-white font-bold text-2xl">
                                    <MailTo email="ieee.ucf@gmail.com" subject="Sponsorship Inquiry" body="Hello IEEE at UCF,">INQUIRE ABOUT SPONSORING</MailTo>
                                </div>
                                {/* fill out later */}
                                {/* <button className="space-y-2 text-white font-bold" onClick={() => setContactForm(!contactUsForm)}>
                                    INQUIRE ABOUT SPONSORING
                                   

                                </button> */}

                                {/* {contactUsForm ? <ContactUs/> : <div></div>} */}
                                
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


            <div className="p-10 bg-black m-10 rounded-xl">
                <iframe src="/IEEE-UCF-Sponsorship-Packet-2025-2026.pdf" width="100%" height="700px"/>
                <div className="my-10"></div>
                
                <a href="/IEEE-UCF-Sponsorship-Packet-2025-2026.pdf" download="IEEE-UCF-Sponsorship-Packet-2025-2026.pdf" className="text-white flex flex-row align-middle items-center gap-x-10">

                    <div className="relative group cursor-pointer">
                        <div className="absolute -inset-1 bg-gradient-to-r from-[var(--ieee-bright-yellow)] to-[var(--ieee-bright-yellow)] rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                                
                        <div className="relative px-7 py-3 bg-[#0c0a09] ring-1 ring-gray-900/5 rounded-lg leading-none flex items-top justify-start space-x-6">
                            <div className="space-y-2">
                                  <button className="text-white font-bold ">DOWNLOAD</button>

                            </div>
                        </div>
                    </div>
                    

                    <div className="relative group cursor-pointer">
                        <div className="absolute -inset-1 bg-gradient-to-r from-[var(--ieee-bright-yellow)] to-[var(--ieee-bright-yellow)] rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                                
                        <div className="relative px-7 py-3 bg-[#0c0a09] ring-1 ring-gray-900/5 rounded-lg leading-none flex items-top justify-start space-x-6">
                            <div className="space-y-2">
                                <a href="/IEEE-UCF-Sponsorship-Packet-2025-2026.pdf" target="_blank" className="font-bold text-white">OPEN IN NEW TAB</a>
                            </div>
                        </div>
                    </div>

                </a>
            </div>

            <Footer/>

            
        </div>

    );
};