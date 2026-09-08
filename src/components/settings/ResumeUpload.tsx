'use client';

import { useRef, useState } from 'react';
import { trpc } from '@/lib/trpc/client';
import { uploadResumeFile } from '@/lib/storage/client';

const MAX_MB = 8;

export function ResumeUpload() {
	const inputRef = useRef<HTMLInputElement>(null);
	const [busy, setBusy] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const utils = trpc.useUtils();
	const { data: policy } = trpc.storage.resumeUploadPolicy.useQuery();
	const { data: profile } = trpc.member.getMyProfile.useQuery();

	const confirm = trpc.storage.confirmResume.useMutation();
	const remove = trpc.storage.deleteMyResume.useMutation({
		onSuccess: () => utils.member.getMyProfile.invalidate(),
	});

	// Audience gate — render nothing unless this account may upload a resume.
	if (!policy?.canUpload) return null;

	const hasResume = Boolean(profile?.resumeKey);
	const uploadedAt = profile?.resumeUploadedAt
		? new Date(profile.resumeUploadedAt).toLocaleDateString()
		: null;

	async function onPick(e: React.ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0];
		e.target.value = '';
		if (!file) return;

		setError(null);
		if (file.type !== 'application/pdf') {
			setError('Resume must be a PDF.');
			return;
		}
		if (file.size > MAX_MB * 1024 * 1024) {
			setError(`Resume must be under ${MAX_MB} MB.`);
			return;
		}

		setBusy(true);
		try {
			await uploadResumeFile(file);
			await confirm.mutateAsync({ filename: file.name });
			await utils.member.getMyProfile.invalidate();
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Upload failed.');
		} finally {
			setBusy(false);
		}
	}

	return (
		<div className="mb-6">
			<h2 className="text-2xl font-[heading-font] mb-4 border-b border-white/20 pb-2">RESUME</h2>

			{hasResume ? (
				<div className="flex flex-wrap items-center gap-3 text-white">
					<a
						href={profile?.resumeURL ?? '#'}
						target="_blank"
						rel="noreferrer"
						className="underline text-[var(--ieee-dark-yellow)]"
					>
						{profile?.resumeFileName ?? 'resume.pdf'}
					</a>
					{uploadedAt && <span className="text-sm text-white/60">uploaded {uploadedAt}</span>}
					<button
						type="button"
						onClick={() => inputRef.current?.click()}
						disabled={busy}
						className="rounded bg-[var(--ieee-dark-yellow)] px-3 py-1 text-sm text-black disabled:opacity-50"
					>
						{busy ? 'Working…' : 'Replace'}
					</button>
					<button
						type="button"
						onClick={() => remove.mutate()}
						disabled={busy || remove.isPending}
						className="rounded bg-[var(--ieee-dark-grey)] px-3 py-1 text-sm text-white disabled:opacity-50"
					>
						Remove
					</button>
				</div>
			) : (
				<div className="flex items-center gap-3">
					<button
						type="button"
						onClick={() => inputRef.current?.click()}
						disabled={busy}
						className="rounded bg-[var(--ieee-dark-yellow)] px-4 py-2 text-black disabled:opacity-50"
					>
						{busy ? 'Uploading…' : 'Upload résumé (PDF)'}
					</button>
					<span className="text-sm text-white/60">PDF, up to {MAX_MB} MB</span>
				</div>
			)}

			{error && <p className="mt-2 text-sm text-red-400">{error}</p>}

			<input
				ref={inputRef}
				type="file"
				accept="application/pdf"
				className="hidden"
				onChange={onPick}
			/>
		</div>
	);
}
