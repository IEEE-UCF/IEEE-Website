import { Navbar } from '@/components/navbar';
import { EventPhotoManager } from '@/components/admin/event-photo-manager';

// /admin/photos is officer-OR-admin (src/middleware.ts officerRoutes)
export default function AdminPhotosPage() {
	return (
		<div className="flex min-h-screen flex-col bg-black">
			<div className="w-full px-5">
				<Navbar />
			</div>
			<main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
				<h1 className="mb-6 text-3xl font-[heading-font] text-[var(--ieee-dark-yellow)]">
					EVENT PHOTOS
				</h1>
				<EventPhotoManager />
			</main>
		</div>
	);
}
