// Local / self-hosted storage adapter — talks to any S3-compatible endpoint (MinIO in dev).
// Selected when STORAGE_PROVIDER=local.

import {
	S3Client,
	GetObjectCommand,
	HeadObjectCommand,
	PutObjectCommand,
	DeleteObjectCommand,
	ListObjectsV2Command,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { localEnv } from './env';
import type {
	GetObjectOptions,
	ListedObject,
	ObjectHead,
	PresignPutOptions,
	StorageAdapter,
	StorageBucket,
	StreamResult,
} from './types';

const env = localEnv();

const client = new S3Client({
	endpoint: env.endpoint,
	region: env.region,
	forcePathStyle: true, // required for MinIO
	credentials: {
		accessKeyId: env.accessKeyId,
		secretAccessKey: env.secretAccessKey,
	},
});

function bucketName(bucket: StorageBucket): string {
	return bucket === 'public' ? env.bucketPublic : env.bucketPrivate;
}

async function bodyToBuffer(body: unknown): Promise<Buffer> {
	// @aws-sdk returns a Node Readable in Node runtimes
	const stream = body as AsyncIterable<Uint8Array>;
	const chunks: Uint8Array[] = [];
	for await (const chunk of stream) chunks.push(chunk);
	return Buffer.concat(chunks);
}

export const localAdapter: StorageAdapter = {
	provider: 'local',

	async presignPut(opts: PresignPutOptions): Promise<string> {
		const cmd = new PutObjectCommand({
			Bucket: bucketName(opts.bucket),
			Key: opts.key,
			ContentType: opts.contentType,
			// Bind the exact length into the signature: the browser's PUT must send this
			// Content-Length or S3/MinIO rejects it. Stops an oversized-body upload.
			...(opts.contentLength != null ? { ContentLength: opts.contentLength } : {}),
		});
		return getSignedUrl(client, cmd, {
			expiresIn: opts.expiresSeconds ?? 120,
			...(opts.contentLength != null ? { signableHeaders: new Set(['content-length']) } : {}),
		});
	},

	async getBytes(opts: GetObjectOptions): Promise<Buffer> {
		const cmd = new GetObjectCommand({
			Bucket: bucketName(opts.bucket),
			Key: opts.key,
			Range: opts.rangeEnd ? `bytes=0-${opts.rangeEnd - 1}` : undefined,
		});
		const res = await client.send(cmd);
		return bodyToBuffer(res.Body);
	},

	async getStream(opts: GetObjectOptions): Promise<StreamResult> {
		const cmd = new GetObjectCommand({
			Bucket: bucketName(opts.bucket),
			Key: opts.key,
		});
		const res = await client.send(cmd);
		const body = res.Body as unknown as { transformToWebStream?: () => ReadableStream<Uint8Array> };
		const stream =
			typeof body.transformToWebStream === 'function'
				? body.transformToWebStream()
				: (res.Body as unknown as ReadableStream<Uint8Array>);
		return {
			stream,
			contentType: res.ContentType,
			size: res.ContentLength,
		};
	},

	async head(opts): Promise<ObjectHead | null> {
		try {
			const res = await client.send(
				new HeadObjectCommand({ Bucket: bucketName(opts.bucket), Key: opts.key }),
			);
			return { size: res.ContentLength ?? 0, contentType: res.ContentType };
		} catch {
			return null;
		}
	},

	async delete(opts): Promise<void> {
		await client.send(
			new DeleteObjectCommand({ Bucket: bucketName(opts.bucket), Key: opts.key }),
		);
	},

	publicUrl(key: string): string {
		return `${env.publicBaseUrl}/${key}`;
	},

	async list(opts): Promise<{ objects: ListedObject[]; nextCursor?: string }> {
		const res = await client.send(
			new ListObjectsV2Command({
				Bucket: bucketName(opts.bucket),
				Prefix: opts.prefix,
				ContinuationToken: opts.cursor,
			}),
		);
		return {
			objects: (res.Contents ?? []).map((o) => ({
				key: o.Key ?? '',
				size: o.Size ?? 0,
				uploadedAt: o.LastModified ?? new Date(0),
			})),
			nextCursor: res.NextContinuationToken,
		};
	},
};
