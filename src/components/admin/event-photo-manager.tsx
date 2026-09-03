'use client';

import { useMemo, useRef, useState } from 'react';
import { trpc } from '@/lib/trpc/client';
import { uploadEventPhoto } from '@/lib/storage/client';

interface UploadRow {
	name: string;
	status: 'uploading' | 'done' | 'error';
	message?: string;
}

export function EventPhotoManager() {
	const fileRef = useRef<HTMLInputElement>(null);
	const [eventId, setEventId] = useState('');
	const [rows, setRows] = useState<UploadRow[]>([]);
	const [busy, setBusy] = useState(false);

	const utils = trpc.useUtils();
	const { data: events } = trpc.event.getAll.useQuery();
	const { data: photos } = trpc.event.adminListPhotos.useQuery(
		{ eventId },
		{ enabled: Boolean(eventId) },
	);

	const confirmPhoto = trpc.event.confirmPhoto.useMutation();
	const deletePhoto = trpc.event.deletePhoto.useMutation({
		onSuccess: () => utils.event.adminListPhotos.invalidate({ eventId }),
	});
	const updatePhoto = trpc.event.updatePhoto.useMutation({
		onSuccess: () => utils.event.adminListPhotos.invalidate({ eventId }),
	});

	const sortedEvents = useMemo(
		() => (events ?? []).slice().sort((a, b) => (a.startTimeRaw < b.startTimeRaw ? 1 : -1)),
		[events],
	);

	async function onFiles(e: React.ChangeEvent<HTMLInputElement>) {
		const files = Array.from(e.target.files ?? []);
		e.target.value = '';
		if (!eventId || files.length === 0) return;

		setBusy(true);
		for (const file of files) {
			const idx = rows.length;
			setRows((r) => [...r, { name: file.name, status: 'uploading' }]);
			try {
				const { photoId, width, height, takenAt } = await uploadEventPhoto(eventId, file);
				await confirmPhoto.mutateAsync({
					eventId,
					photoId,
					filename: file.name,
					width,
					height,
					takenAt: takenAt ?? undefined,
				});
				setRows((r) => r.map((row, i) => (i === idx ? { ...row, status: 'done' } : row)));
			} catch (err) {
				setRows((r) =>
					r.map((row, i) =>
						i === idx
							? { ...row, status: 'error', message: err instanceof Error ? err.message : 'failed' }
							: row,
					),
				);
			}
		}
		setBusy(false);
		await utils.event.adminListPhotos.invalidate({ eventId });
	}

	return (
		<div className="space-y-6 text-gray-100">
			<div>
				<label className="mb-1 block text-sm font-medium">Event</label>
				<select
					value={eventId}
					onChange={(e) => {
						setEventId(e.target.value);
						setRows([]);
					}}
					className="w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-sm"
				>
					<option value="">Select an event…</option>
					{sortedEvents.map((ev) => (
						<option key={ev.id} value={ev.id}>
							{ev.title} — {ev.startTime}
						</option>
					))}
				</select>
			</div>

			<div>
				<button
					type="button"
					disabled={!eventId || busy}
					onClick={() => fileRef.current?.click()}
					className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
				>
					{busy ? 'Uploading…' : 'Add photos'}
				</button>
				<span className="ml-3 text-xs text-gray-400">
					JPEG / PNG / WebP. Resized to 1600px and stripped of location data before upload.
				</span>
				<input
					ref={fileRef}
					type="file"
					accept="image/jpeg,image/png,image/webp"
					multiple
					className="hidden"
					onChange={onFiles}
				/>
			</div>

			{rows.length > 0 && (
				<ul className="space-y-1 text-xs">
					{rows.map((r, i) => (
						<li
							key={i}
							className={
								r.status === 'error'
									? 'text-red-400'
									: r.status === 'done'
										? 'text-green-400'
										: 'text-gray-400'
							}
						>
							{r.name} — {r.status}
							{r.message ? `: ${r.message}` : ''}
						</li>
					))}
				</ul>
			)}

			{eventId && (
				<div>
					<h3 className="mb-3 text-sm font-semibold text-gray-300">
						{photos?.length ?? 0} photo(s)
					</h3>
					<div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
						{(photos ?? []).map((p) => (
							<div key={p.id} className="rounded-lg border border-gray-800 bg-gray-900/60 p-2">
								{/* eslint-disable-next-line @next/next/no-img-element */}
								<img
									src={p.webUrl}
									alt={p.caption ?? p.sourceFilename ?? 'event photo'}
									className="mb-2 h-32 w-full rounded object-cover"
								/>
								<input
									defaultValue={p.caption ?? ''}
									placeholder="Caption"
									onBlur={(e) => {
										if (e.target.value !== (p.caption ?? '')) {
											updatePhoto.mutate({ id: p.id, caption: e.target.value || null });
										}
									}}
									className="mb-1 w-full rounded border border-gray-700 bg-gray-800 px-2 py-1 text-xs"
								/>
								<input
									defaultValue={(p.tags ?? []).join(', ')}
									placeholder="tags, comma, separated"
									onBlur={(e) => {
										const tags = e.target.value
											.split(',')
											.map((t) => t.trim())
											.filter(Boolean);
										updatePhoto.mutate({ id: p.id, tags });
									}}
									className="mb-1 w-full rounded border border-gray-700 bg-gray-800 px-2 py-1 text-xs"
								/>
								<div className="mb-1 flex items-center gap-2 text-xs">
									<span className="text-gray-500">visibility</span>
									<select
										defaultValue={p.visibility}
										onChange={(e) =>
											updatePhoto.mutate({
												id: p.id,
												visibility: e.target.value as 'public' | 'members' | 'private',
											})
										}
										className="flex-1 rounded border border-gray-700 bg-gray-800 px-1 py-0.5"
									>
										<option value="private">private (officers only)</option>
										<option value="members">members</option>
										<option value="public">public (event feed)</option>
									</select>
								</div>
								<div className="flex items-center justify-between text-xs">
									<label className="flex items-center gap-1">
										<input
											type="checkbox"
											defaultChecked={p.featured}
											onChange={(e) =>
												updatePhoto.mutate({ id: p.id, featured: e.target.checked })
											}
										/>
										featured
									</label>
									<button
										type="button"
										onClick={() => {
											if (confirm('Delete this photo?')) deletePhoto.mutate({ id: p.id });
										}}
										className="text-red-400 hover:underline"
									>
										delete
									</button>
								</div>
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	);
}
