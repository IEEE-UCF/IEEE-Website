"use client";

import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { MemberResumeForm } from "@/components/settings/MemberResumeForm";
import { ArrowLeft } from "lucide-react";

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
						className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
					>
						<ArrowLeft size={16} />
						<span>Back to Dashboard</span>
					</Link>
				</div>

				{/* Minimal Header */}
				<div className="mb-6">
					<h1 className="text-2xl font-bold text-gray-100 tracking-tight">
						Add your resume to the resume database
					</h1>
					<p className="text-sm text-gray-400 mt-1">
						Upload your resume and manage your skills and projects for IEEE UCF sponsors and recruiters.
					</p>
				</div>

				{/* Embedded Dedicated Resume Form */}
				<div className="rounded-xl border border-gray-800 bg-[var(--ieee-black)] p-6 shadow-lg shadow-black/40">
					<MemberResumeForm />
				</div>
			</main>

			<Footer />
		</div>
	);
}
