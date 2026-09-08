import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { EventList } from "@/components/dashboard/event-list";
import { Member_QR_Code } from "@/components/dashboard/member-qr-code";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function Dashboard() {
	return (
		<div className="flex flex-col max-w-screen overflow-hidden bg-black min-h-screen text-white">
			{/* Navbar – match home/admin spacing */}
			<div className="w-full px-5">
				<Navbar />
			</div>

			{/* Dashboard Content */}
			<main className="flex-1">
				<div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6">
					{/* Top Section: QR Code and Events side-by-side */}
					<div className="flex flex-col lg:flex-row gap-6">
						{/* QR Code Card */}
						<Card className="flex-1 rounded-xl border border-gray-800 bg-[var(--ieee-black)] p-4 shadow-lg shadow-black/40 lg:p-6">
							<CardHeader>
								<CardTitle className="mb-1 text-lg font-semibold text-gray-100 lg:text-xl">
									Your Check-In QR
								</CardTitle>
							</CardHeader>
							<div className="flex justify-center">
								<Member_QR_Code />
							</div>
						</Card>

						{/* Upcoming Events Card */}
						<Card className="flex-1 rounded-xl border border-gray-800 bg-[--ieee-dark-grey] p-4 shadow-lg shadow-black/40 lg:p-6">
							<CardTitle className="-mb-4 text-lg font-semibold text-gray-100 lg:text-xl">
								Upcoming Events
							</CardTitle>
							<EventList />
						</Card>
					</div>

					{/* Resume Database Card */}
					<Card className="rounded-xl border border-gray-800 bg-[var(--ieee-black)] p-4 shadow-lg shadow-black/40 lg:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
						<div>
							<h2 className="text-lg font-semibold text-gray-100">
								Add your resume to the resume database
							</h2>
							<p className="text-xs text-gray-400 mt-1">
								Share your portfolio, skills, and resume PDF with IEEE UCF sponsors and recruiters.
							</p>
						</div>

						<Button
							asChild
							variant="outline"
							className="border-gray-700 bg-gray-900/60 text-gray-200 hover:bg-gray-800 hover:text-white shrink-0 cursor-pointer"
						>
							<Link href="/dashboard/resume" className="flex items-center gap-2">
								<span>Add Resume</span>
								<ArrowRight size={14} />
							</Link>
						</Button>
					</Card>
				</div>
			</main>
		</div>
	);
}
