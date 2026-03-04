import { Navbar } from "@/components/navbar";
import { EventList } from "@/components/dashboard/event-list";
import { Member_QR_Code } from "@/components/dashboard/member-qr-code";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

export default function Dashboard() {
  return (
    <div className="flex flex-col max-w-screen overflow-hidden bg-black min-h-screen text-black">
      {/* Navbar – match home/admin spacing */}
      <div className="w-full px-5">
        <Navbar />
      </div>

      {/* Dashboard Content */}
      <main className="flex-1">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6 lg:flex-row">
          {/* Left Panel – Upcoming Events */}
          {/* <section className="flex-1 rounded-xl border border-gray-800 bg-gray-900/60 p-4 shadow-lg shadow-black/40 lg:p-6">
            <h2 className="mb-4 text-lg font-semibold text-gray-100 lg:text-xl">
              Upcoming Events
            </h2>
            <EventList />
          </section> */}

          {/* Left Panel – Upcoming Events */}
          <Card className="flex-1 rounded-xl border border-gray-800 bg-gray-900/60 p-4 shadow-lg shadow-black/40 lg:p-6">
            <CardHeader>
              <CardTitle className="mb-4 text-lg font-semibold text-gray-100 lg:text-xl">
                Upcoming Events!
              </CardTitle>
            </CardHeader>
            <EventList />
          </Card>

          {/* Right Panel – Member QR Code */}
          {/* <section className="flex-1 rounded-xl border border-gray-800 bg-gray-900/60 p-4 shadow-lg shadow-black/40 lg:max-w-md lg:p-6">
            <h2 className="mb-4 text-lg font-semibold text-gray-100 lg:text-xl">
              Your Check-In QR2
            </h2>
            <div className="flex justify-center">
              <Member_QR_Code />
            </div>
          </section> */}

          <Card className="flex-1 rounded-xl border border-gray-800 bg-gray-900/60 p-4 shadow-lg shadow-black/40 lg:p-6">
            <CardHeader>
              <CardTitle className="mb-4 text-lg font-semibold text-gray-100 lg:text-xl">
                Your Check-In QR
              </CardTitle>
            </CardHeader>
            <div className="flex justify-center">
              <Member_QR_Code />
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
