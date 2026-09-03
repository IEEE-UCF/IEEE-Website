// Gated resume download. PII — never public, never cached, never indexed.
// Access: the owner, or any officer / administrator.

import { getServerSession } from 'next-auth';
import { eq } from 'drizzle-orm';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/database/client';
import { Members } from '@/lib/database/schema';
import { getStorage } from '@/lib/storage';
import { sanitizeFilename } from '@/lib/storage/keys';
import { hasCapability } from '@/lib/permissions';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(
	_request: Request,
	{ params }: { params: Promise<{ memberId: string }> },
): Promise<Response> {
	const { memberId } = await params;

	const session = await getServerSession(authOptions);
	if (!session?.user?.id) {
		return new Response('Unauthorized', { status: 401 });
	}

	const [member] = await db
		.select({
			id: Members.id,
			userId: Members.userId,
			resumeKey: Members.resumeKey,
			resumeFileName: Members.resumeFileName,
		})
		.from(Members)
		.where(eq(Members.id, memberId))
		.limit(1);

	if (!member?.resumeKey) {
		return new Response('Not found', { status: 404 });
	}

	const isOwner = member.userId === session.user.id;
	const isStaff = hasCapability(session.user, 'review_resumes');
	if (!isOwner && !isStaff) {
		return new Response('Forbidden', { status: 403 });
	}

	const storage = await getStorage();
	let stream;
	try {
		stream = await storage.getStream({ key: member.resumeKey, bucket: 'private' });
	} catch {
		return new Response('Not found', { status: 404 });
	}

	const filename = sanitizeFilename(member.resumeFileName ?? 'resume.pdf');
	return new Response(stream.stream, {
		status: 200,
		headers: {
			'Content-Type': 'application/pdf',
			'Content-Disposition': `inline; filename="${filename}"`,
			'X-Content-Type-Options': 'nosniff',
			'X-Robots-Tag': 'noindex, nofollow',
			'Cache-Control': 'private, no-store, max-age=0',
			...(stream.size ? { 'Content-Length': String(stream.size) } : {}),
		},
	});
}
