import { Navbar } from "@/components/navbar";

export default function Dashboard() {
    return (
        <div className="flex flex-col max-w-screen overflow-hidden bg-black min-h-screen">
            <div className="relative w-full"> 
                <div className="absolute z-4 w-full h-fit inset-0 px-5">
                    <div>This is the admin page</div>
                </div>
            </div>    
        </div>
    );
};