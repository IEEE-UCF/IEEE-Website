// Pure helpers: storage key builders, filename sanitizing, magic-byte sniffing.
// No I/O — safe to import anywhere.

import { randomUUID } from 'crypto';

/** Strip control chars, collapse whitespace, cap length. Never used as a storage key. */
export function sanitizeFilename(name: string | null | undefined): string {
	if (!name) return 'file';
	const cleaned = Array.from(name)
		.filter((ch) => {
			const c = ch.charCodeAt(0);
			return c >= 0x20 && c !== 0x7f; // drop ASCII control chars
		})
		.join('')
		.replace(/[\\/]+/g, '_')
		.replace(/\s+/g, ' ')
		.trim();
	return cleaned.slice(0, 200) || 'file';
}

/** kebab-case slug for OneDrive folder names. */
export function slugify(input: string): string {
	return (
		input
			.toLowerCase()
			.normalize('NFKD')
			.replace(/[^\w\s-]/g, '')
			.trim()
			.replace(/[\s_]+/g, '-')
			.replace(/-+/g, '-')
			.slice(0, 60) || 'untitled'
	);
}

// ---- Storage keys (always derived server-side, never from client input) ----

export function resumeKey(userId: string): string {
	return `resumes/${userId}.pdf`;
}

export interface PhotoKeys {
	photoId: string;
	webKey: string;
	thumbKey: string;
	originalKey: string;
}

export function newPhotoKeys(eventId: string, photoId: string = randomUUID()): PhotoKeys {
	// All event-photo objects live in the private bucket under one prefix.
	return {
		photoId,
		webKey: `event-photos/${eventId}/${photoId}.jpg`,
		thumbKey: `event-photos/${eventId}/${photoId}_thumb.jpg`,
		originalKey: `event-photos/${eventId}/${photoId}_orig.jpg`,
	};
}

/** Extract the photo id (filename stem) from any of its keys. */
export function photoIdFromKey(key: string): string | null {
	const base = key.split('/').pop() ?? '';
	const stem = base.replace(/\.(jpg|jpeg|png|webp)$/i, '').replace(/_(thumb|orig)$/, '');
	return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(stem)
		? stem
		: null;
}

// ---- Magic-byte sniffing ----

const PDF = [0x25, 0x50, 0x44, 0x46, 0x2d]; // %PDF-
const JPEG = [0xff, 0xd8, 0xff];
const PNG = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];

function startsWith(buf: Uint8Array, sig: number[]): boolean {
	if (buf.length < sig.length) return false;
	return sig.every((b, i) => buf[i] === b);
}

export function isPdf(buf: Uint8Array): boolean {
	return startsWith(buf, PDF);
}

export function isJpeg(buf: Uint8Array): boolean {
	return startsWith(buf, JPEG);
}

export function isPng(buf: Uint8Array): boolean {
	return startsWith(buf, PNG);
}

export function isWebp(buf: Uint8Array): boolean {
	// "RIFF" .... "WEBP"
	return (
		buf.length >= 12 &&
		buf[0] === 0x52 &&
		buf[1] === 0x49 &&
		buf[2] === 0x46 &&
		buf[3] === 0x46 &&
		buf[8] === 0x57 &&
		buf[9] === 0x45 &&
		buf[10] === 0x42 &&
		buf[11] === 0x50
	);
}

export function isImage(buf: Uint8Array): boolean {
	return isJpeg(buf) || isPng(buf) || isWebp(buf);
}

/** Does the object's leading bytes match what the declared kind requires? */
export function magicBytesMatchKind(kind: 'resume' | 'event-photo', buf: Uint8Array): boolean {
	return kind === 'resume' ? isPdf(buf) : isImage(buf);
}
