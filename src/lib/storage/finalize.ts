// Shared upload core, provider-independent.
//
//   authorizeUpload()  — runs BEFORE a client token / presigned URL is issued:
//                        auth, kind gate, content-type + size validation, cooldown,
//                        and server-derived storage key.
//   finalizeUpload()   — runs AFTER the bytes land: size re-check, magic-byte sniff,
//                        checksum, and the DB row write. Idempotent on key so it is
//                        safe to call from both the client confirm mutation and (for
//                        the vercel provider) the onUploadCompleted webhook.

import { createHash } from 'crypto';
import { and, eq, gte, sql } from 'drizzle-orm';
import type { Session } from 'next-auth';
import { db } from '@/lib/database/client';
import { EventPhotos, Events, Members, UploadEvents } from '@/lib/database/schema';
import { canUploadResumeSession } from './audience';
import {
	PHOTO_CONTENT_TYPES,
	PHOTO_MAX_BYTES,
	RESUME_CONTENT_TYPES,
	RESUME_MAX_BYTES,
	UPLOAD_COOLDOWN_MAX,
	UPLOAD_COOLDOWN_WINDOW_MS,
} from './env';
import { getStorage } from './index';
import { magicBytesMatchKind, newPhotoKeys, resumeKey, sanitizeFilename } from './keys';
import type { StorageBucket, UploadKind } from './types';

export class UploadError extends Error {
	constructor(
		public readonly code: 'UNAUTHORIZED' | 'FORBIDDEN' | 'BAD_REQUEST' | 'TOO_MANY' | 'NOT_FOUND',
		message: string,
	) {
		super(message);
		this.name = 'UploadError';
	}
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export interface UploadIntent {
	kind: UploadKind;
	contentType: string;
	byteSize: number;
	filename?: string | null;
	// event-photo only
	eventId?: string;
	/** Optional caller-provided id (vercel handleUpload flow needs the key up front). */
	photoId?: string;
	width?: number | null;
	height?: number | null;
	takenAt?: string | null; // ISO, read from EXIF client-side before re-encode
	caption?: string | null;
	tags?: string[];
}

export interface AuthorizedUpload {
	kind: UploadKind;
	bucket: StorageBucket;
	key: string;
	contentType: string;
	maxBytes: number;
	/** Exact declared size — bound into the presigned upload so the body can't exceed it. */
	contentLength: number;
	/** event-photo: the row id / filename stem, decided here so keys and row stay in sync. */
	photoId?: string;
	/** echoed back through the client token / confirm call */
	tokenPayload: {
		kind: UploadKind;
		key: string;
		userId: string;
		eventId?: string;
		photoId?: string;
		filename?: string | null;
		width?: number | null;
		height?: number | null;
		takenAt?: string | null;
		caption?: string | null;
		tags?: string[];
	};
}

async function assertCooldown(userId: string, kind: UploadKind) {
	const since = new Date(Date.now() - UPLOAD_COOLDOWN_WINDOW_MS);
	const [{ count }] = await db
		.select({ count: sql<number>`count(*)::int` })
		.from(UploadEvents)
		.where(
			and(
				eq(UploadEvents.userId, userId),
				eq(UploadEvents.kind, kind),
				gte(UploadEvents.createdAt, since),
			),
		);
	if (count >= UPLOAD_COOLDOWN_MAX) {
		throw new UploadError('TOO_MANY', 'Upload rate limit reached, try again shortly');
	}
}

export async function authorizeUpload(
	session: Session | null,
	intent: UploadIntent,
): Promise<AuthorizedUpload> {
	if (!session?.user?.id) {
		throw new UploadError('UNAUTHORIZED', 'Sign in required');
	}
	const userId = session.user.id;

	if (intent.kind === 'resume') {
		if (!canUploadResumeSession(session)) {
			throw new UploadError('FORBIDDEN', 'Resume upload is not enabled for your account yet');
		}
		if (!(RESUME_CONTENT_TYPES as readonly string[]).includes(intent.contentType)) {
			throw new UploadError('BAD_REQUEST', 'Resume must be a PDF');
		}
		if (intent.byteSize > RESUME_MAX_BYTES) {
			throw new UploadError('BAD_REQUEST', 'Resume exceeds the 8 MB limit');
		}
		await assertCooldown(userId, 'resume');

		const key = resumeKey(userId);
		return {
			kind: 'resume',
			bucket: 'private',
			key,
			contentType: intent.contentType,
			maxBytes: RESUME_MAX_BYTES,
			contentLength: intent.byteSize,
			tokenPayload: {
				kind: 'resume',
				key,
				userId,
				filename: sanitizeFilename(intent.filename),
			},
		};
	}

	// event-photo
	if (!session.user.administrator) {
		throw new UploadError('FORBIDDEN', 'Administrator privileges required');
	}
	if (!intent.eventId) {
		throw new UploadError('BAD_REQUEST', 'eventId is required');
	}
	if (!(PHOTO_CONTENT_TYPES as readonly string[]).includes(intent.contentType)) {
		throw new UploadError('BAD_REQUEST', 'Photo must be a JPEG, PNG or WebP');
	}
	if (intent.byteSize > PHOTO_MAX_BYTES) {
		throw new UploadError('BAD_REQUEST', 'Photo exceeds the 15 MB limit');
	}

	const [event] = await db
		.select({ id: Events.id })
		.from(Events)
		.where(eq(Events.id, intent.eventId))
		.limit(1);
	if (!event) {
		throw new UploadError('NOT_FOUND', 'Event not found');
	}

	await assertCooldown(userId, 'event-photo');

	const providedId = intent.photoId && UUID_RE.test(intent.photoId) ? intent.photoId : undefined;
	const keys = newPhotoKeys(intent.eventId, providedId);
	return {
		kind: 'event-photo',
		// Private by default — a photo only reaches the public feed once its
		// visibility is explicitly set to 'public'.
		bucket: 'private',
		key: keys.webKey,
		contentType: intent.contentType,
		maxBytes: PHOTO_MAX_BYTES,
		contentLength: intent.byteSize,
		photoId: keys.photoId,
		tokenPayload: {
			kind: 'event-photo',
			key: keys.webKey,
			userId,
			eventId: intent.eventId,
			photoId: keys.photoId,
			filename: sanitizeFilename(intent.filename),
			width: intent.width ?? null,
			height: intent.height ?? null,
			takenAt: intent.takenAt ?? null,
			caption: intent.caption?.slice(0, 2000) ?? null,
			tags: (intent.tags ?? []).map((t) => t.trim().toLowerCase()).filter(Boolean).slice(0, 20),
		},
	};
}

const MAGIC_SNIFF_BYTES = 16;

export interface FinalizeResult {
	kind: UploadKind;
	resume?: { memberId: string; url: string };
	photoId?: string;
}

/**
 * Validate the landed object and write its DB row(s). Safe to call more than once for
 * the same key.
 */
export async function finalizeUpload(payload: AuthorizedUpload['tokenPayload']): Promise<FinalizeResult> {
	const storage = await getStorage();
	// Both resumes and event photos are stored privately; event photos are exposed to
	// the public feed only via a per-row visibility flag, never a direct bucket URL.
	const bucket: StorageBucket = 'private';

	const head = await storage.head({ key: payload.key, bucket });
	if (!head) {
		throw new UploadError('NOT_FOUND', 'Uploaded object not found');
	}
	const maxBytes = payload.kind === 'resume' ? RESUME_MAX_BYTES : PHOTO_MAX_BYTES;
	if (head.size > maxBytes) {
		await storage.delete({ key: payload.key, bucket });
		throw new UploadError('BAD_REQUEST', 'Uploaded file exceeds the size limit');
	}

	const sniff = await storage.getBytes({ key: payload.key, bucket, rangeEnd: MAGIC_SNIFF_BYTES });
	if (!magicBytesMatchKind(payload.kind, sniff)) {
		await storage.delete({ key: payload.key, bucket });
		throw new UploadError('BAD_REQUEST', 'File content does not match its declared type');
	}

	const full = await storage.getBytes({ key: payload.key, bucket });
	const checksum = createHash('sha256').update(full).digest('hex');

	if (payload.kind === 'resume') {
		const [member] = await db
			.select({ id: Members.id })
			.from(Members)
			.where(eq(Members.userId, payload.userId))
			.limit(1);
		if (!member) {
			throw new UploadError(
				'FORBIDDEN',
				'Complete your member registration before uploading a resume',
			);
		}
		const url = `/api/files/resume/${member.id}`;
		await db
			.update(Members)
			.set({
				resumeKey: payload.key,
				resumeFileName: payload.filename ?? 'resume.pdf',
				resumeUploadedAt: new Date(),
				resumeURL: url,
				updatedAt: new Date(),
			})
			.where(eq(Members.id, member.id));

		await db.insert(UploadEvents).values({ userId: payload.userId, kind: 'resume' });
		return { kind: 'resume', resume: { memberId: member.id, url } };
	}

	// event-photo
	const photoId = payload.photoId!;
	const existing = await db
		.select({ id: EventPhotos.id })
		.from(EventPhotos)
		.where(eq(EventPhotos.id, photoId))
		.limit(1);

	if (existing.length === 0) {
		const tags = payload.tags ?? [];
		const searchText = [payload.caption ?? '', tags.join(' '), payload.filename ?? '']
			.join(' ')
			.trim();
		await db.insert(EventPhotos).values({
			id: photoId,
			eventId: payload.eventId!,
			uploadedByUserId: payload.userId,
			webKey: payload.key,
			// Gated app route, not a storage URL — access is enforced per request.
			webUrl: `/api/files/event-photo/${photoId}`,
			contentType: head.contentType ?? 'image/jpeg',
			sizeBytes: head.size,
			width: payload.width ?? null,
			height: payload.height ?? null,
			checksumSha256: checksum,
			sourceFilename: payload.filename ?? null,
			caption: payload.caption ?? null,
			tags,
			takenAt: payload.takenAt ? new Date(payload.takenAt) : null,
			searchText,
		});
		await db.insert(UploadEvents).values({ userId: payload.userId, kind: 'event-photo' });
	}

	return { kind: 'event-photo', photoId };
}
