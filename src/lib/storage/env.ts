// Storage configuration, read once from the environment.
// Mirrors the DB_PROVIDER switch in src/lib/database/client.ts.

export type StorageProvider = 'local' | 'vercel';

export const STORAGE_PROVIDER: StorageProvider =
	process.env.STORAGE_PROVIDER === 'vercel' ? 'vercel' : 'local';

/** Audience allowed to upload a resume. Widened over time via env, no code change. */
export type ResumeAudience = 'admins' | 'officers' | 'members';

export const RESUME_UPLOAD_AUDIENCE: ResumeAudience = ((): ResumeAudience => {
	const v = process.env.RESUME_UPLOAD_AUDIENCE;
	if (v === 'officers' || v === 'members') return v;
	return 'admins';
})();

// Upload ceilings (bytes) and allowed content types, enforced server-side.
export const RESUME_MAX_BYTES = 8 * 1024 * 1024; // 8 MB
export const PHOTO_MAX_BYTES = 15 * 1024 * 1024; // 15 MB

export const RESUME_CONTENT_TYPES = ['application/pdf'] as const;
export const PHOTO_CONTENT_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const;

// Per-user cooldown: max uploads of one kind within the window.
export const UPLOAD_COOLDOWN_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
export const UPLOAD_COOLDOWN_MAX = 30;

interface LocalStorageEnv {
	endpoint: string;
	region: string;
	accessKeyId: string;
	secretAccessKey: string;
	bucketPublic: string;
	bucketPrivate: string;
	publicBaseUrl: string;
}

interface VercelStorageEnv {
	tokenPublic: string;
	tokenPrivate: string;
}

export function localEnv(): LocalStorageEnv {
	const {
		S3_ENDPOINT,
		S3_REGION,
		S3_ACCESS_KEY_ID,
		S3_SECRET_ACCESS_KEY,
		S3_BUCKET_PUBLIC,
		S3_BUCKET_PRIVATE,
		S3_PUBLIC_BASE_URL,
	} = process.env;

	if (!S3_ENDPOINT || !S3_ACCESS_KEY_ID || !S3_SECRET_ACCESS_KEY) {
		throw new Error(
			'STORAGE_PROVIDER=local requires S3_ENDPOINT, S3_ACCESS_KEY_ID and S3_SECRET_ACCESS_KEY',
		);
	}

	const bucketPublic = S3_BUCKET_PUBLIC ?? 'media-public';
	const endpoint = S3_ENDPOINT.replace(/\/$/, '');

	return {
		endpoint,
		region: S3_REGION ?? 'us-east-1',
		accessKeyId: S3_ACCESS_KEY_ID,
		secretAccessKey: S3_SECRET_ACCESS_KEY,
		bucketPublic,
		bucketPrivate: S3_BUCKET_PRIVATE ?? 'resumes-private',
		publicBaseUrl: (S3_PUBLIC_BASE_URL ?? `${endpoint}/${bucketPublic}`).replace(/\/$/, ''),
	};
}

export function vercelEnv(): VercelStorageEnv {
	// One Blob store today, holding all (private) media. Vercel names its token
	// BLOB_READ_WRITE_TOKEN when you connect a store — use that by default.
	// BLOB_RW_TOKEN_PRIVATE / _PUBLIC are optional overrides for a future two-store setup.
	const privateToken =
		process.env.BLOB_RW_TOKEN_PRIVATE ?? process.env.BLOB_READ_WRITE_TOKEN;
	if (!privateToken) {
		throw new Error(
			'STORAGE_PROVIDER=vercel requires BLOB_READ_WRITE_TOKEN (or BLOB_RW_TOKEN_PRIVATE)',
		);
	}
	return {
		tokenPublic: process.env.BLOB_RW_TOKEN_PUBLIC ?? privateToken,
		tokenPrivate: privateToken,
	};
}
