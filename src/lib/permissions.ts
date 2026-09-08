// Capability vocabulary — the single source of truth for granular permissions.
//
// A member "has" a capability if ANY of these is true:
//   - member.administrator            (admins can do everything)
//   - member.officerStatus            (officers get every capability by default)
//   - an active member_permissions row with permission = <capability>
//
// `staff: true`  → a staff tool; grants /staff access and shows in the nav.
// `staff: false` → a member-facing feature grant (e.g. an upload pilot); does NOT
//                  make the member "staff".
//
// Add a capability here + enforce it with capabilityProcedure(...) — no migration
// needed (member_permissions.permission is a plain varchar).

export const CAPABILITIES = {
	scan_attendance: { label: 'Scan event check-in', staff: true },
	manage_events: { label: 'Create & edit events', staff: true },
	manage_event_photos: { label: 'Upload & manage event photos', staff: true },
	review_resumes: { label: 'View résumés', staff: true },
	// Résumé-upload rollout — Phase 2: grant to a pilot cohort while the env audience
	// stays at "officers". Phase 3 = flip RESUME_UPLOAD_AUDIENCE to "members".
	upload_resume: { label: 'Upload a résumé (pilot)', staff: false },
} as const;

export type Capability = keyof typeof CAPABILITIES;

export const CAPABILITY_KEYS = Object.keys(CAPABILITIES) as Capability[];
export const STAFF_CAPABILITY_KEYS = CAPABILITY_KEYS.filter((k) => CAPABILITIES[k].staff);

// Capabilities an admin MAY choose to let officers grant to plain members.
// (Role changes, manage_events, and review_resumes are never officer-delegable.)
export const OFFICER_DELEGABLE_CAPABILITIES = [
	'scan_attendance',
	'manage_event_photos',
	'upload_resume',
] as const satisfies readonly Capability[];
export type OfficerDelegableCapability = (typeof OFFICER_DELEGABLE_CAPABILITIES)[number];

export function isOfficerDelegable(cap: string): cap is OfficerDelegableCapability {
	return (OFFICER_DELEGABLE_CAPABILITIES as readonly string[]).includes(cap);
}

export function isCapability(v: string): v is Capability {
	return v in CAPABILITIES;
}

/** Does this list of granted permission strings include any staff capability? */
export function hasStaffCapability(permissions: string[] | null | undefined): boolean {
	if (!Array.isArray(permissions)) return false;
	return permissions.some((p) => (STAFF_CAPABILITY_KEYS as string[]).includes(p));
}

export interface CapabilitySubject {
	administrator?: boolean | null;
	officerStatus?: boolean | null;
	permissions?: string[] | null;
}

export function hasCapability(subject: CapabilitySubject | null | undefined, cap: Capability): boolean {
	if (!subject) return false;
	if (subject.administrator || subject.officerStatus) return true;
	return Array.isArray(subject.permissions) && subject.permissions.includes(cap);
}
