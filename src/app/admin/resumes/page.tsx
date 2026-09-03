import { Navbar } from '@/components/navbar';
import { ResumeDashboard } from '@/components/admin/resume-dashboard';

// /admin/resumes is officer-OR-admin (src/middleware.ts officerRoutes).
// (The listResumes query is officer-or-admin; this page sits under the admin area.)
export default function AdminResumesPage() {
	return (
		<div className="flex min-h-screen flex-col bg-black">
			<div className="w-full px-5">
				<Navbar />
			</div>
			<main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
				<h1 className="mb-6 text-3xl font-[heading-font] text-[var(--ieee-dark-yellow)]">
					RÉSUMÉS
				</h1>
				<ResumeDashboard />
			</main>
		</div>
	);
}
