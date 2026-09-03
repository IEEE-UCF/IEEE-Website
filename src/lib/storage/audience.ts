// Résumé-upload audience gate.
//
//   Phase 2 (now):  RESUME_UPLOAD_AUDIENCE=officers, plus per-member `upload_resume`
//                   grants for a pilot cohort (managed on /admin/members).
//   Phase 3:        flip RESUME_UPLOAD_AUDIENCE=members — the grant is then redundant.
//
// Checked in three places:
//   - the upload-token route (src/app/api/blob/upload/route.ts)
//   - the storage.confirmResume / storage.deleteMyResume tRPC mutations
//   - whether <ResumeUpload> renders in the form

import type { Session } from 'next-auth';
import { RESUME_UPLOAD_AUDIENCE } from './env';

export interface AudienceUser {
	administrator?: boolean;
	officerStatus?: boolean;
	memberId?: string | null;
	permissions?: string[] | null;
}

export function canUploadResume(user: AudienceUser | null | undefined): boolean {
	if (!user) return false;
	if (user.administrator) return true;

	// Phase-2 pilot lever: an explicit per-member grant, independent of the audience.
	if (Array.isArray(user.permissions) && user.permissions.includes('upload_resume')) return true;

	switch (RESUME_UPLOAD_AUDIENCE) {
		case 'members':
			return Boolean(user.memberId) || Boolean(user.officerStatus);
		case 'officers':
			return Boolean(user.officerStatus);
		case 'admins':
		default:
			return false;
	}
}

export function canUploadResumeSession(session: Session | null | undefined): boolean {
	return canUploadResume(session?.user);
}

export { RESUME_UPLOAD_AUDIENCE };
