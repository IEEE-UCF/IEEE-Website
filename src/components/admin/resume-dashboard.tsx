'use client';

import { useMemo, useState } from 'react';
import { trpc } from '@/lib/trpc/client';

export function ResumeDashboard() {
	const { data, isLoading } = trpc.officer.listResumes.useQuery();
	const [q, setQ] = useState('');
	const [onlyWithResume, setOnlyWithResume] = useState(true);
	const [preview, setPreview] = useState<string | null>(null);

	const rows = useMemo(() => {
		const list = data ?? [];
		const needle = q.trim().toLowerCase();
		return list.filter((r) => {
			if (onlyWithResume && !r.hasResume) return false;
			if (!needle) return true;
			return `${r.firstName} ${r.lastName} ${r.major}`.toLowerCase().includes(needle);
		});
	}, [data, q, onlyWithResume]);

	return (
		<div className="grid gap-6 lg:grid-cols-[1fr_minmax(0,480px)]">
			<div className="text-gray-100">
				<div className="mb-4 flex flex-wrap items-center gap-4">
					<input
						value={q}
						onChange={(e) => setQ(e.target.value)}
						placeholder="Search name or major…"
						className="rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-sm"
					/>
					<label className="flex items-center gap-2 text-sm">
						<input
							type="checkbox"
							checked={onlyWithResume}
							onChange={(e) => setOnlyWithResume(e.target.checked)}
						/>
						only members with a résumé
					</label>
				</div>

				{isLoading ? (
					<p className="text-sm text-gray-400">Loading…</p>
				) : (
					<div className="overflow-x-auto rounded-lg border border-gray-800">
						<table className="w-full text-left text-sm">
							<thead className="bg-gray-900 text-gray-300">
								<tr>
									<th className="px-3 py-2">Name</th>
									<th className="px-3 py-2">Major</th>
									<th className="px-3 py-2">Grad</th>
									<th className="px-3 py-2">Résumé</th>
								</tr>
							</thead>
							<tbody>
								{rows.map((r) => (
									<tr key={r.memberId} className="border-t border-gray-800">
										<td className="px-3 py-2">
											{r.firstName} {r.lastName}
										</td>
										<td className="px-3 py-2 text-gray-400">{r.major}</td>
										<td className="px-3 py-2 text-gray-400">{r.graduationYear}</td>
										<td className="px-3 py-2">
											{r.hasResume && r.resumeUrl ? (
												<div className="flex items-center gap-3">
													<button
														type="button"
														onClick={() => setPreview(r.resumeUrl!)}
														className="text-[var(--ieee-dark-yellow)] hover:underline"
													>
														preview
													</button>
													<a
														href={r.resumeUrl}
														target="_blank"
														rel="noreferrer"
														className="text-gray-300 hover:underline"
													>
														open
													</a>
													{r.resumeUploadedAt && (
														<span className="text-xs text-gray-500">
															{new Date(r.resumeUploadedAt).toLocaleDateString()}
														</span>
													)}
												</div>
											) : (
												<span className="text-gray-600">none</span>
											)}
										</td>
									</tr>
								))}
								{rows.length === 0 && (
									<tr>
										<td colSpan={4} className="px-3 py-6 text-center text-gray-500">
											No matching members.
										</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>
				)}
			</div>

			<div className="rounded-lg border border-gray-800 bg-gray-900/50 p-2">
				{preview ? (
					<iframe title="résumé preview" src={preview} className="h-[70vh] w-full rounded" />
				) : (
					<p className="p-6 text-sm text-gray-500">Select “preview” to view a résumé here.</p>
				)}
			</div>
		</div>
	);
}
