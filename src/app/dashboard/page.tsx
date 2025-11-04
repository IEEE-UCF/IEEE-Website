import { Navbar } from "@/components/navbar";
import { FormPopup } from "@/components/dashboard/form";

export default function Dashboard() {
    return (
        <div className="flex flex-col max-w-screen overflow-hidden bg-black min-h-screen">
            <div className="relative w-full"> 
                <div className="absolute z-4 w-full h-fit inset-0 px-5">
                    <Navbar />
                </div>
            </div>
            <div className="flex justify-center items-center h-screen">
                <FormPopup />
            </div>
        </div>
    );
};
