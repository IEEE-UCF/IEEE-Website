// Storage entry point. Picks the adapter from STORAGE_PROVIDER and memoizes it.
// Only the selected adapter module is loaded, so the other provider's env vars are
// never required.

import { STORAGE_PROVIDER } from './env';
import type { StorageAdapter } from './types';

let cached: Promise<StorageAdapter> | null = null;

export function getStorage(): Promise<StorageAdapter> {
	if (!cached) {
		cached =
			STORAGE_PROVIDER === 'vercel'
				? import('./vercel').then((m) => m.vercelAdapter)
				: import('./local').then((m) => m.localAdapter);
	}
	return cached;
}

export { STORAGE_PROVIDER } from './env';
export type { StorageAdapter, StorageBucket, UploadKind } from './types';
