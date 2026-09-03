import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/database/client';
import { Members } from '@/lib/database/schema';
import { createTRPCRouter, protectedProcedure } from '../trpc';
import { RESUME_UPLOAD_AUDIENCE, canUploadResumeSession } from '@/lib/storage/audience';
import { finalizeUpload, UploadError } from '@/lib/storage/finalize';
import { resumeKey, sanitizeFilename } from '@/lib/storage/keys';
import { getStorage } from '@/lib/storage';

function mapUploadError(err: unknown): TRPCError {
	if (err instanceof UploadError) {
		const code =
			err.code === 'UNAUTHORIZED'
				? 'UNAUTHORIZED'
				: err.code === 'FORBIDDEN'
					? 'FORBIDDEN'
					: err.code === 'NOT_FOUND'
						? 'NOT_FOUND'
						: err.code === 'TOO_MANY'
							? 'TOO_MANY_REQUESTS'
							: 'BAD_REQUEST';
		return new TRPCError({ code, message: err.message });
	}
	return new TRPCError({
		code: 'INTERNAL_SERVER_ERROR',
		message: err instanceof Error ? err.message : 'Upload finalize failed',
	});
}

export const storageRouter = createTRPCRouter({
	/** Audience gate state, so the UI knows whether to render the resume field. */
	resumeUploadPolicy: protectedProcedure.query(({ ctx }) => ({
		audience: RESUME_UPLOAD_AUDIENCE,
		canUpload: canUploadResumeSession(ctx.session),
	})),

	/** Called by the browser after a resume PDF has been uploaded to storage. */
	confirmResume: protectedProcedure
		.input(z.object({ filename: z.string().max(255).optional() }))
		.mutation(async ({ ctx, input }) => {
			if (!canUploadResumeSession(ctx.session)) {
				throw new TRPCError({
					code: 'FORBIDDEN',
					message: 'Resume upload is not enabled for your account yet',
				});
			}
			try {
				return await finalizeUpload({
					kind: 'resume',
					key: resumeKey(ctx.session.user.id),
					userId: ctx.session.user.id,
					filename: sanitizeFilename(input.filename),
				});
			} catch (err) {
				throw mapUploadError(err);
			}
		}),

	deleteMyResume: protectedProcedure.mutation(async ({ ctx }) => {
		const [member] = await db
			.select({ id: Members.id, resumeKey: Members.resumeKey })
			.from(Members)
			.where(eq(Members.userId, ctx.session.user.id))
			.limit(1);

		if (!member) {
			throw new TRPCError({ code: 'NOT_FOUND', message: 'Member profile not found' });
		}
		if (member.resumeKey) {
			const storage = await getStorage();
			await storage.delete({ key: member.resumeKey, bucket: 'private' }).catch(() => undefined);
		}
		await db
			.update(Members)
			.set({
				resumeKey: null,
				resumeFileName: null,
				resumeUploadedAt: null,
				resumeURL: null,
				resumeOnedrivePath: null,
				updatedAt: new Date(),
			})
			.where(eq(Members.id, member.id));

		return { success: true };
	}),
});
