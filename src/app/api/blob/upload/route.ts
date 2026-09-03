// Upload entry point for both storage providers.
//
//   local  → JSON in, JSON out with a presigned PUT URL. The browser PUTs the bytes,
//            then calls a storage.confirm* tRPC mutation.
//   vercel → @vercel/blob client-upload token exchange via handleUpload(). The browser
//            uses `upload()` from @vercel/blob/client, then also calls a confirm mutation
//            as a backstop for abandoned uploads (onUploadCompleted is the other path).

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { z } from 'zod';
import { authOptions } from '@/lib/auth';
import { STORAGE_PROVIDER, getStorage } from '@/lib/storage';
import { vercelEnv } from '@/lib/storage/env';
import { authorizeUpload, finalizeUpload, UploadError, type UploadIntent } from '@/lib/storage/finalize';

export const runtime = 'nodejs';

const intentSchema = z.object({
	kind: z.enum(['resume', 'event-photo']),
	contentType: z.string().min(1).max(100),
	byteSize: z.number().int().positive(),
	filename: z.string().max(255).nullish(),
	eventId: z.string().uuid().optional(),
	photoId: z.string().uuid().optional(),
	width: z.number().int().positive().nullish(),
	height: z.number().int().positive().nullish(),
	takenAt: z.string().datetime().nullish(),
	caption: z.string().max(2000).nullish(),
	tags: z.array(z.string().max(40)).max(20).optional(),
});

function errorStatus(code: UploadError['code']): number {
	switch (code) {
		case 'UNAUTHORIZED':
			return 401;
		case 'FORBIDDEN':
			return 403;
		case 'NOT_FOUND':
			return 404;
		case 'TOO_MANY':
			return 429;
		default:
			return 400;
	}
}

export async function POST(request: Request): Promise<Response> {
	const session = await getServerSession(authOptions);

	// ---- vercel provider: delegate to handleUpload ----
	if (STORAGE_PROVIDER === 'vercel') {
		const body = (await request.json()) as HandleUploadBody;
		try {
			const json = await handleUpload({
				token: vercelEnv().tokenPrivate,
				body,
				request,
				onBeforeGenerateToken: async (pathname, clientPayload) => {
					const parsed = intentSchema.parse(JSON.parse(clientPayload ?? '{}'));
					const authorized = await authorizeUpload(session, parsed as UploadIntent);
					if (authorized.key !== pathname) {
						throw new UploadError('BAD_REQUEST', 'pathname does not match authorized key');
					}
					return {
						allowedContentTypes: [authorized.contentType],
						maximumSizeInBytes: authorized.maxBytes,
						addRandomSuffix: false,
						allowOverwrite: authorized.kind === 'resume',
						tokenPayload: JSON.stringify(authorized.tokenPayload),
					};
				},
				onUploadCompleted: async ({ tokenPayload }) => {
					if (tokenPayload) await finalizeUpload(JSON.parse(tokenPayload));
				},
			});
			return NextResponse.json(json);
		} catch (err) {
			if (err instanceof UploadError) {
				return NextResponse.json({ error: err.message }, { status: errorStatus(err.code) });
			}
			return NextResponse.json({ error: (err as Error).message }, { status: 400 });
		}
	}

	// ---- local provider: presigned PUT ----
	try {
		const parsed = intentSchema.parse(await request.json());
		const authorized = await authorizeUpload(session, parsed as UploadIntent);
		const storage = await getStorage();
		const uploadUrl = await storage.presignPut({
			key: authorized.key,
			bucket: authorized.bucket,
			contentType: authorized.contentType,
			maxBytes: authorized.maxBytes,
			contentLength: authorized.contentLength,
		});
		return NextResponse.json({
			provider: 'local',
			key: authorized.key,
			photoId: authorized.photoId,
			uploadUrl,
			publicUrl: authorized.bucket === 'public' ? storage.publicUrl(authorized.key) : null,
			tokenPayload: authorized.tokenPayload,
		});
	} catch (err) {
		if (err instanceof UploadError) {
			return NextResponse.json({ error: err.message }, { status: errorStatus(err.code) });
		}
		if (err instanceof z.ZodError) {
			return NextResponse.json({ error: 'Invalid request', issues: err.issues }, { status: 400 });
		}
		return NextResponse.json({ error: (err as Error).message }, { status: 500 });
	}
}
