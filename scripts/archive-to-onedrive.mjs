// Nightly archive: copy new media from the live store into the org OneDrive / SharePoint,
// record the path on each DB row, and drop a per-event _manifest.json so the archive is
// self-describing. rclone handles OneDrive auth out-of-band (no Microsoft Graph code).
//
// Env:
//   DATABASE_URL                Postgres connection string
//   STORAGE_PROVIDER            "local" | "vercel"  (which live store to read from)
//   S3_* / BLOB_RW_TOKEN_*      credentials for that store (same names the app uses)
//   RCLONE_REMOTE               rclone remote name for OneDrive, e.g. "onedrive"
//   ARCHIVE_ROOT                path prefix in the remote, default "IEEE-Website"
//   ARCHIVE_INCLUDE_RESUMES     "true" to also archive resumes (PII) — default false
//
// rclone must be on PATH and configured (RCLONE_CONFIG / secrets in CI).

import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { Client } from 'pg';

const run = promisify(execFile);

const {
	DATABASE_URL,
	RCLONE_REMOTE = 'onedrive',
	ARCHIVE_ROOT = 'IEEE-Website',
	ARCHIVE_INCLUDE_RESUMES = 'false',
} = process.env;

if (!DATABASE_URL) throw new Error('DATABASE_URL is required');

// --- live store readers (kept tiny; mirror src/lib/storage adapters) ---
async function makeReader() {
	const provider = process.env.STORAGE_PROVIDER === 'vercel' ? 'vercel' : 'local';
	if (provider === 'vercel') {
		const { get } = await import('@vercel/blob');
		const tokPublic = process.env.BLOB_RW_TOKEN_PUBLIC;
		const tokPrivate = process.env.BLOB_RW_TOKEN_PRIVATE;
		return async (key, bucket) => {
			const res = await get(key, {
				access: bucket === 'public' ? 'public' : 'private',
				token: bucket === 'public' ? tokPublic : tokPrivate,
			});
			if (!res || res.statusCode !== 200) throw new Error(`missing blob ${key}`);
			const chunks = [];
			const reader = res.stream.getReader();
			for (;;) {
				const { done, value } = await reader.read();
				if (done) break;
				chunks.push(Buffer.from(value));
			}
			return Buffer.concat(chunks);
		};
	}
	const { S3Client, GetObjectCommand } = await import('@aws-sdk/client-s3');
	const s3 = new S3Client({
		endpoint: process.env.S3_ENDPOINT,
		region: process.env.S3_REGION || 'us-east-1',
		forcePathStyle: true,
		credentials: {
			accessKeyId: process.env.S3_ACCESS_KEY_ID,
			secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
		},
	});
	const buckets = {
		public: process.env.S3_BUCKET_PUBLIC || 'media-public',
		private: process.env.S3_BUCKET_PRIVATE || 'resumes-private',
	};
	return async (key, bucket) => {
		const out = await s3.send(new GetObjectCommand({ Bucket: buckets[bucket], Key: key }));
		const chunks = [];
		for await (const c of out.Body) chunks.push(c);
		return Buffer.concat(chunks);
	};
}

async function rcloneCopy(localPath, remotePath) {
	await run('rclone', ['copyto', localPath, `${RCLONE_REMOTE}:${ARCHIVE_ROOT}/${remotePath}`]);
}

function slug(s) {
	return (s || 'untitled')
		.toLowerCase()
		.replace(/[^\w\s-]/g, '')
		.trim()
		.replace(/[\s_]+/g, '-')
		.slice(0, 60) || 'untitled';
}

async function main() {
	const read = await makeReader();
	const db = new Client({ connectionString: DATABASE_URL });
	await db.connect();
	const scratch = await mkdtemp(join(tmpdir(), 'ieee-archive-'));

	try {
		// ---- event photos ----
		const { rows: photos } = await db.query(`
			SELECT p.id, p.event_id, p.web_key, p.caption, p.tags, p.taken_at,
			       p.uploaded_by_user_id, p.size_bytes,
			       e.title AS event_title, e.start_time AS event_start
			FROM event_photos p JOIN events e ON e.id = p.event_id
			WHERE p.onedrive_path IS NULL
			ORDER BY p.event_id, p.created_at
		`);

		const manifests = new Map(); // folder -> array
		for (const p of photos) {
			const date = new Date(p.event_start).toISOString().slice(0, 10);
			const folder = `events/${date.slice(0, 4)}/${date}_${slug(p.event_title)}_${String(p.event_id).slice(0, 8)}`;
			const remotePath = `${folder}/${p.id}.jpg`;

			const bytes = await read(p.web_key, 'public');
			const tmp = join(scratch, `${p.id}.jpg`);
			await writeFile(tmp, bytes);
			await rcloneCopy(tmp, remotePath);
			await db.query('UPDATE event_photos SET onedrive_path = $1, archived_at = now() WHERE id = $2', [
				remotePath,
				p.id,
			]);

			if (!manifests.has(folder)) manifests.set(folder, []);
			manifests.get(folder).push({
				id: p.id,
				caption: p.caption,
				tags: p.tags,
				takenAt: p.taken_at,
				uploadedBy: p.uploaded_by_user_id,
				sizeBytes: p.size_bytes,
			});
			console.log(`archived photo ${p.id} -> ${remotePath}`);
		}

		for (const [folder, entries] of manifests) {
			const tmp = join(scratch, 'manifest.json');
			await writeFile(tmp, JSON.stringify(entries, null, 2));
			await rcloneCopy(tmp, `${folder}/_manifest.json`);
		}

		// ---- resumes (opt-in) ----
		if (ARCHIVE_INCLUDE_RESUMES === 'true') {
			const { rows: resumes } = await db.query(`
				SELECT id, first_name, last_name, graduation_year, resume_key
				FROM members
				WHERE resume_key IS NOT NULL AND resume_onedrive_path IS NULL
			`);
			for (const m of resumes) {
				const remotePath = `resumes/${m.graduation_year}/${slug(`${m.last_name}-${m.first_name}`)}_${String(m.id).slice(0, 8)}.pdf`;
				const bytes = await read(m.resume_key, 'private');
				const tmp = join(scratch, `${m.id}.pdf`);
				await writeFile(tmp, bytes);
				await rcloneCopy(tmp, remotePath);
				await db.query('UPDATE members SET resume_onedrive_path = $1 WHERE id = $2', [remotePath, m.id]);
				console.log(`archived resume ${m.id} -> ${remotePath}`);
			}
		}

		console.log(`done: ${photos.length} photo(s) archived`);
	} finally {
		await db.end();
		await rm(scratch, { recursive: true, force: true });
	}
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
