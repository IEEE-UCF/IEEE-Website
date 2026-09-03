// Gated event-photo delivery.
//   visibility = 'public' (and approved)  → anyone, cacheable (the public event feed)
//   otherwise                             → officers / admins only, no-store
// Bytes always live in the private bucket; this route is the only way to read them.

import { getServerSession } from 'next-auth';
import { eq } from 'drizzle-orm';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/database/client';
import { EventPhotos } from '@/lib/database/schema';
import { getStorage } from '@/lib/storage';
import { hasCapability } from '@/lib/permissions';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(
	_request: Request,
	{ params }: { params: Promise<{ id: string }> },
): Promise<Response> {
	const { id } = await params;

	const [photo] = await db
		.select({
			webKey: EventPhotos.webKey,
			contentType: EventPhotos.contentType,
			visibility: EventPhotos.visibility,
			approved: EventPhotos.approved,
		})
		.from(EventPhotos)
		.where(eq(EventPhotos.id, id))
		.limit(1);

	if (!photo) {
		return new Response('Not found', { status: 404 });
	}

	const isPublic = photo.visibility === 'public' && photo.approved;

	if (!isPublic) {
		const session = await getServerSession(authOptions);
		if (!session?.user?.id) {
			return new Response('Unauthorized', { status: 401 });
		}
		if (!hasCapability(session.user, 'manage_event_photos')) {
			return new Response('Forbidden', { status: 403 });
		}
	}

	const storage = await getStorage();
	let stream;
	try {
		stream = await storage.getStream({ key: photo.webKey, bucket: 'private' });
	} catch {
		return new Response('Not found', { status: 404 });
	}

	const headers: Record<string, string> = {
		'Content-Type': photo.contentType || stream.contentType || 'image/jpeg',
		'X-Content-Type-Options': 'nosniff',
	};
	if (isPublic) {
		headers['Cache-Control'] = 'public, max-age=86400, immutable';
	} else {
		headers['Cache-Control'] = 'private, no-store, max-age=0';
		headers['X-Robots-Tag'] = 'noindex, nofollow';
	}
	if (stream.size) headers['Content-Length'] = String(stream.size);

	return new Response(stream.stream, { status: 200, headers });
}
