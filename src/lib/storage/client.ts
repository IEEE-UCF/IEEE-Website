// Browser-side upload helper. Hides the difference between the two providers:
//   local  → POST intent to /api/blob/upload, then PUT bytes to the presigned URL
//   vercel → @vercel/blob/client `upload()` token exchange
//
// Callers run the matching `storage.confirmResume` / `event.confirmPhoto` tRPC mutation
// afterwards (those need React context, so they stay in the component).

'use client';

const PROVIDER =
	process.env.NEXT_PUBLIC_STORAGE_PROVIDER === 'vercel' ? 'vercel' : 'local';

const UPLOAD_URL = '/api/blob/upload';

async function localPut(intent: Record<string, unknown>, file: Blob): Promise<{ key: string; photoId?: string }> {
	const res = await fetch(UPLOAD_URL, {
		method: 'POST',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify(intent),
	});
	if (!res.ok) {
		const body = await res.json().catch(() => ({}));
		throw new Error(body.error || `Upload authorization failed (${res.status})`);
	}
	const { uploadUrl, key, photoId } = await res.json();
	const put = await fetch(uploadUrl, {
		method: 'PUT',
		headers: { 'content-type': (file as File).type || 'application/octet-stream' },
		body: file,
	});
	if (!put.ok) throw new Error(`Upload failed (${put.status})`);
	return { key, photoId };
}

export async function uploadResumeFile(file: File): Promise<void> {
	const intent = {
		kind: 'resume' as const,
		contentType: file.type,
		byteSize: file.size,
		filename: file.name,
	};

	if (PROVIDER === 'vercel') {
		const { upload } = await import('@vercel/blob/client');
		// resume key is deterministic per user; the server recomputes + verifies it.
		const userId = await currentUserId();
		await upload(`resumes/${userId}.pdf`, file, {
			access: 'private',
			handleUploadUrl: UPLOAD_URL,
			clientPayload: JSON.stringify(intent),
		});
		return;
	}

	await localPut(intent, file);
}

export interface EventPhotoUploadResult {
	photoId: string;
	width: number;
	height: number;
	takenAt: string | null;
}

export async function uploadEventPhoto(
	eventId: string,
	original: File,
): Promise<EventPhotoUploadResult> {
	const { default: imageCompression } = await import('browser-image-compression');
	const exifr = await import('exifr');

	// Read EXIF DateTimeOriginal BEFORE re-encoding strips it.
	let takenAt: string | null = null;
	try {
		const parsed = await exifr.parse(original, ['DateTimeOriginal', 'CreateDate']);
		const d: Date | undefined = parsed?.DateTimeOriginal ?? parsed?.CreateDate;
		if (d instanceof Date && !Number.isNaN(d.getTime())) takenAt = d.toISOString();
	} catch {
		/* no EXIF — fine */
	}

	const web = await imageCompression(original, {
		maxWidthOrHeight: 1600,
		maxSizeMB: 1,
		useWebWorker: true,
		fileType: 'image/jpeg',
	});
	const { width, height } = await imageDimensions(web);

	const photoId = crypto.randomUUID();
	const intent = {
		kind: 'event-photo' as const,
		eventId,
		photoId,
		contentType: 'image/jpeg',
		byteSize: web.size,
		filename: original.name,
		width,
		height,
		takenAt,
	};

	if (PROVIDER === 'vercel') {
		const { upload } = await import('@vercel/blob/client');
		// Private store — served only through /api/files/event-photo/[id].
		await upload(`event-photos/${eventId}/${photoId}.jpg`, web, {
			access: 'private',
			handleUploadUrl: UPLOAD_URL,
			clientPayload: JSON.stringify(intent),
		});
	} else {
		await localPut(intent, web);
	}

	return { photoId, width, height, takenAt };
}

async function imageDimensions(blob: Blob): Promise<{ width: number; height: number }> {
	const url = URL.createObjectURL(blob);
	try {
		const img = new Image();
		await new Promise<void>((resolve, reject) => {
			img.onload = () => resolve();
			img.onerror = () => reject(new Error('could not read image'));
			img.src = url;
		});
		return { width: img.naturalWidth, height: img.naturalHeight };
	} finally {
		URL.revokeObjectURL(url);
	}
}

async function currentUserId(): Promise<string> {
	const res = await fetch('/api/auth/session');
	const session = await res.json();
	const id = session?.user?.id;
	if (!id) throw new Error('Not signed in');
	return id as string;
}
