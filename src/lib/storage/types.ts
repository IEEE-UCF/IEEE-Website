// Shared types for the storage abstraction.
//
// Two adapters implement StorageAdapter:
//   - local.ts   → MinIO / any S3-compatible endpoint (used for local dev + the manual test script)
//   - vercel.ts  → Vercel Blob (used on preview + production)
// A future graph.ts would back the same interface with Microsoft Graph / OneDrive.

export type StorageBucket = 'public' | 'private';

export type UploadKind = 'resume' | 'event-photo';

export interface PresignPutOptions {
	key: string;
	bucket: StorageBucket;
	contentType: string;
	maxBytes: number;
	/**
	 * Exact byte length the upload must have. When set, it is bound into the signature
	 * so the client cannot PUT a body of a different size than it declared.
	 */
	contentLength?: number;
	expiresSeconds?: number;
}

export interface GetObjectOptions {
	key: string;
	bucket: StorageBucket;
	/** When set, only the first N bytes are fetched (used for magic-byte sniffing). */
	rangeEnd?: number;
}

export interface ObjectHead {
	size: number;
	contentType?: string;
}

export interface ListedObject {
	key: string;
	size: number;
	uploadedAt: Date;
}

export interface StreamResult {
	/** A web ReadableStream suitable for returning from a Next.js route handler. */
	stream: ReadableStream<Uint8Array>;
	contentType?: string;
	size?: number;
}

export interface StorageAdapter {
	readonly provider: 'local' | 'vercel';

	/**
	 * Return a URL the browser can PUT bytes to directly.
	 * The vercel adapter does not use this (its client-upload flow goes through
	 * `handleUpload` in the route); it throws instead.
	 */
	presignPut(opts: PresignPutOptions): Promise<string>;

	/** Fetch object bytes (optionally just a prefix) for server-side validation. */
	getBytes(opts: GetObjectOptions): Promise<Buffer>;

	/** Stream an object back to the client (used by the gated resume route). */
	getStream(opts: GetObjectOptions): Promise<StreamResult>;

	head(opts: { key: string; bucket: StorageBucket }): Promise<ObjectHead | null>;

	delete(opts: { key: string; bucket: StorageBucket }): Promise<void>;

	/** Public, CDN-style URL for an object in the public bucket. */
	publicUrl(key: string): string;

	list(opts: { bucket: StorageBucket; prefix?: string; cursor?: string }): Promise<{
		objects: ListedObject[];
		nextCursor?: string;
	}>;
}
