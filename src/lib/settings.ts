// Small key/value app-settings store backed by the `app_settings` table.
// Values are JSON-encoded text. Add typed accessors here as settings are added.

import { db } from '@/lib/database/client';
import { AppSettings } from '@/lib/database/schema';
import { eq } from 'drizzle-orm';
import {
	OFFICER_DELEGABLE_CAPABILITIES,
	isOfficerDelegable,
	type OfficerDelegableCapability,
} from '@/lib/permissions';

const OFFICER_GRANTABLE_KEY = 'officer_grantable_capabilities';

async function readJson<T>(key: string, fallback: T): Promise<T> {
	const [row] = await db
		.select({ value: AppSettings.value })
		.from(AppSettings)
		.where(eq(AppSettings.key, key))
		.limit(1);
	if (!row) return fallback;
	try {
		return JSON.parse(row.value) as T;
	} catch {
		return fallback;
	}
}

async function writeJson(key: string, value: unknown): Promise<void> {
	const encoded = JSON.stringify(value);
	await db
		.insert(AppSettings)
		.values({ key, value: encoded })
		.onConflictDoUpdate({ target: AppSettings.key, set: { value: encoded, updatedAt: new Date() } });
}

/**
 * Which capabilities an admin has allowed officers to grant/revoke for plain members.
 * Always a subset of OFFICER_DELEGABLE_CAPABILITIES. Default: none (admin opts in).
 */
export async function getOfficerGrantableCapabilities(): Promise<OfficerDelegableCapability[]> {
	const raw = await readJson<string[]>(OFFICER_GRANTABLE_KEY, []);
	return OFFICER_DELEGABLE_CAPABILITIES.filter((c) => raw.includes(c));
}

export async function setOfficerGrantableCapabilities(
	caps: string[],
): Promise<OfficerDelegableCapability[]> {
	const clean = [...new Set(caps.filter(isOfficerDelegable))];
	await writeJson(OFFICER_GRANTABLE_KEY, clean);
	return OFFICER_DELEGABLE_CAPABILITIES.filter((c) => clean.includes(c));
}
