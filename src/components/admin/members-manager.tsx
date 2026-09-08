'use client';

import { useMemo, useState } from 'react';
import { useSession } from 'next-auth/react';
import { trpc } from '@/lib/trpc/client';
import { officerRoleEnum } from '@/lib/database/schema';
import { CAPABILITIES, CAPABILITY_KEYS, type Capability } from '@/lib/permissions';

type RoleFilter = 'all' | 'admin' | 'officer' | 'none';
type OfficerRole = (typeof officerRoleEnum.enumValues)[number];

const asOfficerRole = (v: string): OfficerRole | null =>
	(officerRoleEnum.enumValues as readonly string[]).includes(v) ? (v as OfficerRole) : null;

export function MembersManager() {
	const { data: session } = useSession();
	const myMemberId = session?.user?.memberId;
	const isAdmin = Boolean(session?.user?.administrator);

	const utils = trpc.useUtils();
	const { data: members, isLoading, error: listError } = trpc.member.listForAdmin.useQuery();
	const grantable = trpc.settings.officerGrantableCapabilities.useQuery();
	const delegableCaps = grantable.data?.delegable ?? [];
	const officerEnabledCaps = grantable.data?.enabled ?? [];
	const canToggleCap = (cap: Capability) =>
		isAdmin || (officerEnabledCaps as string[]).includes(cap);

	const [q, setQ] = useState('');
	const [role, setRole] = useState<RoleFilter>('all');
	const [onlyActive, setOnlyActive] = useState(true);

	// per-row transient status: id -> 'saving' | 'saved' | error message
	const [status, setStatus] = useState<Record<string, string>>({});
	const mark = (id: string, s: string) => setStatus((p) => ({ ...p, [id]: s }));
	const clearSoon = (id: string) =>
		setTimeout(() => setStatus((p) => ({ ...p, [id]: '' })), 2500);

	const refresh = () => utils.member.listForAdmin.invalidate();
	const setAdmin = trpc.member.setAdmin.useMutation();
	const setOfficer = trpc.member.setOfficer.useMutation();
	const setPermission = trpc.member.setPermission.useMutation();
	const setGrantable = trpc.settings.setOfficerGrantableCapabilities.useMutation();

	const [delegationMsg, setDelegationMsg] = useState('');
	async function toggleDelegable(cap: string, on: boolean) {
		setDelegationMsg('saving…');
		try {
			const next = on
				? [...officerEnabledCaps, cap]
				: officerEnabledCaps.filter((c) => c !== cap);
			await setGrantable.mutateAsync({ capabilities: next });
			await grantable.refetch();
			setDelegationMsg('saved ✓');
			setTimeout(() => setDelegationMsg(''), 2000);
		} catch (e) {
			setDelegationMsg(e instanceof Error ? e.message : 'failed');
		}
	}

	async function runAdmin(id: string, value: boolean) {
		mark(id, 'saving');
		try {
			await setAdmin.mutateAsync({ id, value });
			await refresh();
			mark(id, 'saved');
			clearSoon(id);
		} catch (e) {
			mark(id, e instanceof Error ? e.message : 'failed');
		}
	}
	async function runOfficer(id: string, officerStatus: boolean, officerRole: OfficerRole | null) {
		mark(id, 'saving');
		try {
			await setOfficer.mutateAsync({ id, officerStatus, officerRole });
			await refresh();
			mark(id, 'saved');
			clearSoon(id);
		} catch (e) {
			mark(id, e instanceof Error ? e.message : 'failed');
		}
	}
	async function runPermission(memberId: string, permission: Capability, granted: boolean) {
		mark(memberId, 'saving');
		try {
			await setPermission.mutateAsync({ memberId, permission, granted });
			await refresh();
			mark(memberId, 'saved');
			clearSoon(memberId);
		} catch (e) {
			mark(memberId, e instanceof Error ? e.message : 'failed');
		}
	}

	const rows = useMemo(() => {
		const needle = q.trim().toLowerCase();
		return (members ?? []).filter((m) => {
			if (onlyActive && !m.active) return false;
			if (role === 'admin' && !m.administrator) return false;
			if (role === 'officer' && !m.officerStatus) return false;
			if (role === 'none' && (m.administrator || m.officerStatus)) return false;
			if (!needle) return true;
			return `${m.firstName} ${m.lastName} ${m.ucfEmail} ${m.personalEmail} ${m.userEmail ?? ''} ${m.major}`
				.toLowerCase()
				.includes(needle);
		});
	}, [members, q, role, onlyActive]);

	const counts = useMemo(() => {
		const list = members ?? [];
		return {
			total: list.length,
			admins: list.filter((m) => m.administrator).length,
			officers: list.filter((m) => m.officerStatus).length,
		};
	}, [members]);

	if (listError) {
		return (
			<p className="rounded border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300">
				Failed to load members: {listError.message}
			</p>
		);
	}

	return (
		<div className="text-gray-100">
			{isAdmin && (
				<div className="mb-4 rounded-lg border border-gray-800 bg-gray-900/50 p-3 text-sm">
					<div className="mb-1 flex items-center gap-2">
						<span className="font-semibold text-gray-200">Officer delegation</span>
						{delegationMsg && (
							<span
								className={`text-xs ${
									delegationMsg === 'saving…'
										? 'text-gray-400'
										: delegationMsg === 'saved ✓'
											? 'text-green-400'
											: 'text-red-400'
								}`}
							>
								{delegationMsg}
							</span>
						)}
					</div>
					<p className="mb-2 text-xs text-gray-400">
						Capabilities officers may grant to regular members. Officers can never change
						admin/officer roles, and can only act on members who are not staff.
					</p>
					<div className="flex flex-wrap gap-4">
						{delegableCaps.map((cap) => (
							<label key={cap} className="flex items-center gap-1.5">
								<input
									type="checkbox"
									checked={officerEnabledCaps.includes(cap)}
									disabled={grantable.isLoading || delegationMsg === 'saving…'}
									onChange={(e) => toggleDelegable(cap, e.target.checked)}
								/>
								<span>{CAPABILITIES[cap as Capability]?.label ?? cap}</span>
								<code className="text-[10px] text-gray-500">{cap}</code>
							</label>
						))}
						{delegableCaps.length === 0 && (
							<span className="text-xs text-gray-500">No delegable capabilities.</span>
						)}
					</div>
				</div>
			)}

			<div className="mb-4 flex flex-wrap items-center gap-3 text-sm">
				<input
					value={q}
					onChange={(e) => setQ(e.target.value)}
					placeholder="Search name / email / major…"
					className="rounded-md border border-gray-700 bg-gray-900 px-3 py-2"
				/>
				<select
					value={role}
					onChange={(e) => setRole(e.target.value as RoleFilter)}
					className="rounded-md border border-gray-700 bg-gray-900 px-2 py-2"
				>
					<option value="all">All roles</option>
					<option value="admin">Admins</option>
					<option value="officer">Officers</option>
					<option value="none">Members only</option>
				</select>
				<label className="flex items-center gap-2">
					<input type="checkbox" checked={onlyActive} onChange={(e) => setOnlyActive(e.target.checked)} />
					active only
				</label>
				<span className="ml-auto text-gray-400">
					{counts.total} members · {counts.admins} admins · {counts.officers} officers
					{rows.length !== counts.total && ` · ${rows.length} shown`}
				</span>
			</div>

			{isLoading ? (
				<p className="text-sm text-gray-400">Loading…</p>
			) : (
				<div className="overflow-x-auto rounded-lg border border-gray-800">
					<table className="w-full text-left text-sm">
						<thead className="bg-gray-900 text-gray-300">
							<tr>
								<th className="px-3 py-2">Name</th>
								<th className="px-3 py-2">Email</th>
								<th className="px-3 py-2">Major / Year</th>
								<th className="px-3 py-2">Admin</th>
								<th className="px-3 py-2">Officer</th>
								<th className="px-3 py-2">Capabilities</th>
								<th className="px-3 py-2">Dues</th>
								<th className="px-3 py-2">Résumé</th>
								<th className="px-3 py-2">Committees</th>
								<th className="px-3 py-2">Discord</th>
							</tr>
						</thead>
						<tbody>
							{rows.map((m) => {
								const isSelf = m.id === myMemberId;
								const st = status[m.id];
								return (
									<tr key={m.id} className={`border-t border-gray-800 ${m.active ? '' : 'opacity-50'}`}>
										<td className="px-3 py-2 whitespace-nowrap">
											{m.firstName} {m.lastName}
											{isSelf && (
												<span className="ml-1 text-xs text-[var(--ieee-dark-yellow)]">(you)</span>
											)}
											{st && (
												<div
													className={`text-xs ${
														st === 'saving'
															? 'text-gray-400'
															: st === 'saved'
																? 'text-green-400'
																: 'text-red-400'
													}`}
												>
													{st === 'saving' ? 'saving…' : st === 'saved' ? 'saved ✓' : st}
												</div>
											)}
										</td>
										<td className="px-3 py-2 text-gray-400">
											<div>{m.ucfEmail}</div>
											{m.personalEmail && <div className="text-xs">{m.personalEmail}</div>}
										</td>
										<td className="px-3 py-2 text-gray-400">
											<div className="max-w-[220px] truncate">{m.major}</div>
											<div className="text-xs">{m.graduationYear}</div>
										</td>

										{/* Admin */}
										<td className="px-3 py-2">
											{isAdmin ? (
												<button
													type="button"
													disabled={isSelf || st === 'saving'}
													onClick={() => runAdmin(m.id, !m.administrator)}
													title={isSelf ? "You can't change your own admin access" : undefined}
													className={`rounded px-2 py-1 text-xs font-semibold disabled:opacity-40 ${
														m.administrator
															? 'bg-[var(--ieee-dark-yellow)] text-black'
															: 'border border-gray-600 text-gray-300 hover:border-gray-400'
													}`}
												>
													{m.administrator ? 'Admin' : 'Make admin'}
												</button>
											) : (
												<span className="text-xs text-gray-400">{m.administrator ? 'Admin' : '—'}</span>
											)}
										</td>

										{/* Officer */}
										<td className="px-3 py-2">
											{isAdmin ? (
												<div className="flex items-center gap-2">
													<button
														type="button"
														disabled={st === 'saving'}
														onClick={() =>
															runOfficer(m.id, !m.officerStatus, m.officerStatus ? null : asOfficerRole(m.officerRole ?? ''))
														}
														className={`rounded px-2 py-1 text-xs font-semibold disabled:opacity-40 ${
															m.officerStatus
																? 'bg-blue-600 text-white'
																: 'border border-gray-600 text-gray-300 hover:border-gray-400'
														}`}
													>
														{m.officerStatus ? 'Officer' : 'Make officer'}
													</button>
													<select
														value={m.officerRole ?? ''}
														disabled={!m.officerStatus || st === 'saving'}
														onChange={(e) => runOfficer(m.id, true, asOfficerRole(e.target.value))}
														className="rounded border border-gray-700 bg-gray-800 px-1 py-0.5 text-xs disabled:opacity-40"
													>
														<option value="">— role —</option>
														{officerRoleEnum.enumValues.map((r) => (
															<option key={r} value={r}>
																{r}
															</option>
														))}
													</select>
												</div>
											) : (
												<span className="text-xs text-gray-400">
													{m.officerStatus
														? `Officer${m.officerRole ? ` · ${m.officerRole}` : ''}`
														: '—'}
												</span>
											)}
										</td>

										{/* Capabilities — implied for admins/officers, else per-grant toggles */}
										<td className="px-3 py-2">
											{m.administrator || m.officerStatus ? (
												<span className="text-xs text-gray-500">all (via {m.administrator ? 'admin' : 'officer'})</span>
											) : (
												<div className="flex max-w-[260px] flex-wrap gap-1">
													{CAPABILITY_KEYS.map((cap) => {
														const on = m.permissions.includes(cap);
														const allowed = canToggleCap(cap);
														return (
															<button
																key={cap}
																type="button"
																disabled={st === 'saving' || !allowed}
																onClick={() => runPermission(m.id, cap, !on)}
																title={
																	allowed
																		? CAPABILITIES[cap].label
																		: `${CAPABILITIES[cap].label} — only an admin can grant this`
																}
																className={`rounded px-1.5 py-0.5 text-xs disabled:opacity-40 ${
																	on
																		? 'bg-green-700 text-white'
																		: 'border border-gray-600 text-gray-400 hover:border-gray-400'
																}`}
															>
																{cap}
															</button>
														);
													})}
												</div>
											)}
										</td>

										<td className="px-3 py-2 text-gray-400">{m.duesPaid ? 'paid' : '—'}</td>
										<td className="px-3 py-2 text-gray-400">
											{m.hasResume && m.resumeUrl ? (
												<a
													href={m.resumeUrl}
													target="_blank"
													rel="noreferrer"
													className="text-[var(--ieee-dark-yellow)] hover:underline"
												>
													{m.resumeUploadedAt
														? new Date(m.resumeUploadedAt).toLocaleDateString()
														: 'view'}
												</a>
											) : (
												'—'
											)}
										</td>
										<td className="px-3 py-2">
											<div className="flex max-w-[200px] flex-wrap gap-1">
												{m.committees.length === 0 && <span className="text-gray-600">—</span>}
												{m.committees.map((c) => (
													<span
														key={c.id}
														className={`rounded px-1.5 py-0.5 text-xs ${
															c.isChair
																? 'bg-[var(--ieee-dark-yellow)] text-black'
																: 'bg-gray-800 text-gray-300'
														}`}
														title={c.isChair ? `${c.title} (chair)` : c.title}
													>
														{c.slug ?? c.title}
														{c.isChair ? '★' : ''}
													</span>
												))}
											</div>
										</td>
										<td className="px-3 py-2 text-xs text-gray-400">
											{m.discordLinked ? (
												(m.userName ?? 'linked')
											) : (
												<span className="text-gray-600">not linked</span>
											)}
										</td>
									</tr>
								);
							})}
							{rows.length === 0 && (
								<tr>
									<td colSpan={10} className="px-3 py-6 text-center text-gray-500">
										No matching members.
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			)}
		</div>
	);
}
