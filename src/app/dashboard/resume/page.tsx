"use client";

import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { MemberResumeForm } from "@/components/settings/MemberResumeForm";
import { ArrowLeft, FileText, Sparkles } from "lucide-react";

export default function DashboardResumePage() {
	return (
		<div className="flex flex-col min-h-screen bg-black text-white">
			{/* Navbar */}
			<div className="w-full px-5">
				<Navbar />
			</div>

			<main className="flex-1 w-full max-w-5xl mx-auto px-4 py-8">
				{/* Breadcrumb / Back Link */}
				<div className="mb-6">
					<Link
						href="/dashboard"
						className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-amber-400 transition-colors"
					>
						<ArrowLeft size={16} />
						<span>Back to Dashboard</span>
					</Link>
				</div>

				{/* Header Banner */}
				<div className="mb-8 p-6 rounded-2xl border border-zinc-800 bg-gradient-to-r from-zinc-900/90 via-zinc-900/60 to-zinc-950 shadow-xl">
					<div className="flex items-center gap-3 mb-2">
						<div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
							<FileText size={22} />
						</div>
						<div>
							<h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
								Member Resume Database Profile
								<span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center gap-1">
									<Sparkles size={11} />
									Sponsor Viewable
								</span>
							</h1>
							<p className="text-sm text-zinc-400 mt-1">
								Manage your technical portfolio, skills, project highlights, and resume PDF for IEEE UCF corporate sponsors and recruiters.
							</p>
						</div>
					</div>
				</div>

				{/* Embedded Dedicated Resume Form */}
				<div className="bg-zinc-950/70 border border-zinc-800/80 rounded-2xl p-6 shadow-2xl">
					<MemberResumeForm />
				</div>
			</main>

			<Footer />
		</div>
	);
}
