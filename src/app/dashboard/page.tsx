import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { EventList } from "@/components/dashboard/event-list";
import { Member_QR_Code } from "@/components/dashboard/member-qr-code";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";

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

					{/* Resume Database Showcase Card */}
					<Card className="rounded-xl border border-zinc-800 bg-gradient-to-br from-zinc-900/90 via-zinc-900/50 to-zinc-950 p-6 shadow-xl relative overflow-hidden group">
						<div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

						<div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
							<div className="flex items-start gap-4">
								<div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
									<FileText size={24} />
								</div>
								<div>
									<div className="flex items-center gap-2 mb-1">
										<h2 className="text-xl font-bold text-white tracking-tight">
											Member Resume Database
										</h2>
										<span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center gap-1">
											<Sparkles size={11} />
											Recruiter Network
										</span>
									</div>
									<p className="text-sm text-zinc-400 max-w-2xl leading-relaxed">
										Build and publish your technical portfolio, skills, project highlights, and resume PDF to appear in the dedicated IEEE UCF candidate directory for corporate sponsors.
									</p>
									<div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-zinc-400">
										<span className="flex items-center gap-1.5">
											<CheckCircle2 size={13} className="text-amber-500" />
											1-to-1 Profile Sync
										</span>
										<span className="flex items-center gap-1.5">
											<CheckCircle2 size={13} className="text-amber-500" />
											Skills & Project Repeaters
										</span>
										<span className="flex items-center gap-1.5">
											<CheckCircle2 size={13} className="text-amber-500" />
											PDF Resume Dropzone
										</span>
									</div>
								</div>
							</div>

							<Button
								asChild
								className="bg-amber-500 hover:bg-amber-400 text-black font-semibold shrink-0 px-5 shadow-lg shadow-amber-500/10 cursor-pointer"
							>
								<Link href="/dashboard/resume" className="flex items-center gap-2">
									<span>Manage Resume Profile</span>
									<ArrowRight size={16} />
								</Link>
							</Button>
						</div>
					</Card>
				</div>
			</main>
		</div>
	);
}
