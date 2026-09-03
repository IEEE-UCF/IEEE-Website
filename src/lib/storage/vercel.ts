// Vercel Blob storage adapter — selected when STORAGE_PROVIDER=vercel (preview + production).
//
// NOTE: the browser-upload path for this provider goes through `handleUpload` directly in
// the route (see src/app/api/blob/upload/route.ts), so `presignPut` is intentionally
// unsupported here. Everything else (validation reads, streaming, delete, list) uses the
// @vercel/blob SDK. This adapter is exercised on a preview deploy, not locally.

import { head as blobHead, del as blobDel, list as blobList, get as blobGet } from '@vercel/blob';
import { vercelEnv } from './env';
import type {
	GetObjectOptions,
	ListedObject,
	ObjectHead,
	StorageAdapter,
	StorageBucket,
	StreamResult,
} from './types';

const env = vercelEnv();

function token(bucket: StorageBucket): string {
	return bucket === 'public' ? env.tokenPublic : env.tokenPrivate;
}

function access(bucket: StorageBucket): 'public' | 'private' {
	return bucket === 'public' ? 'public' : 'private';
}

async function readAll(stream: ReadableStream<Uint8Array>): Promise<Buffer> {
	const reader = stream.getReader();
	const chunks: Uint8Array[] = [];
	for (;;) {
		const { done, value } = await reader.read();
		if (done) break;
		if (value) chunks.push(value);
	}
	return Buffer.concat(chunks);
}

// Blobs are addressed by pathname within a store; @vercel/blob resolves the store from the token.
export const vercelAdapter: StorageAdapter = {
	provider: 'vercel',

	async presignPut(): Promise<string> {
		throw new Error(
			'vercel adapter uses handleUpload for browser uploads, not presigned PUT',
		);
	},

	async getBytes(opts: GetObjectOptions): Promise<Buffer> {
		const res = await blobGet(opts.key, { access: access(opts.bucket), token: token(opts.bucket) });
		if (res?.statusCode !== 200 || !res.stream) {
			throw new Error(`blob not found: ${opts.key}`);
		}
		const buf = await readAll(res.stream);
		return opts.rangeEnd ? buf.subarray(0, opts.rangeEnd) : buf;
	},

	async getStream(opts: GetObjectOptions): Promise<StreamResult> {
		const res = await blobGet(opts.key, { access: access(opts.bucket), token: token(opts.bucket) });
		if (res?.statusCode !== 200 || !res.stream) {
			throw new Error(`blob not found: ${opts.key}`);
		}
		return {
			stream: res.stream,
			contentType: res.blob.contentType ?? undefined,
			size: res.blob.size ?? undefined,
		};
	},

	async head(opts): Promise<ObjectHead | null> {
		try {
			const meta = await blobHead(opts.key, { token: token(opts.bucket) });
			return { size: meta.size, contentType: meta.contentType };
		} catch {
			return null;
		}
	},

	async delete(opts): Promise<void> {
		await blobDel(opts.key, { token: token(opts.bucket) });
	},

	publicUrl(key: string): string {
		// Public blobs are served from the store's own domain; the concrete URL is what
		// `put()` / `upload()` returns and is what we persist as event_photos.webUrl.
		// This helper is only a best-effort fallback when we have a key but no stored URL.
		return key;
	},

	async list(opts): Promise<{ objects: ListedObject[]; nextCursor?: string }> {
		const res = await blobList({
			token: token(opts.bucket),
			prefix: opts.prefix,
			cursor: opts.cursor,
		});
		return {
			objects: res.blobs.map((b) => ({
				key: b.pathname,
				size: b.size,
				uploadedAt: b.uploadedAt,
			})),
			nextCursor: res.cursor,
		};
	},
};
