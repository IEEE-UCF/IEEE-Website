'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Calendar } from '@/components/calendar';
import { trpc } from '@/lib/trpc/client';

const STORAGE_KEY = 'ieee_ucf_gbm_date';
const DEFAULT_GBM_DATE = '2026-04-01T19:30:00-04:00'; // update each semester

function loadGBMDate(): string {
	if (typeof window === 'undefined') return DEFAULT_GBM_DATE;
	return localStorage.getItem(STORAGE_KEY) ?? DEFAULT_GBM_DATE;
}

function saveGBMDate(iso: string) {
	localStorage.setItem(STORAGE_KEY, iso);
}

function pad(n: number) {
	return String(n).padStart(2, '0');
}

function calcTimeLeft(target: number) {
	const distance = target - Date.now();
	if (distance <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
	return {
		days: Math.floor(distance / (1000 * 60 * 60 * 24)),
		hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
		minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
		seconds: Math.floor((distance % (1000 * 60)) / 1000),
	};
}

function isoToInputValue(iso: string): string {
	const d = new Date(iso);
	if (isNaN(d.getTime())) return '';
	const p = (n: number) => String(n).padStart(2, '0');
	return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
}

const Timer: React.FC = () => {
	// Lazy init from localStorage — no stale-default flash on first render
	const [gbmDate, setGbmDate] = useState<string>(() => loadGBMDate());
	const [timeLeft, setTimeLeft] = useState(() => calcTimeLeft(new Date(loadGBMDate()).getTime()));
	const [isEditing, setIsEditing] = useState(false);
	const [inputValue, setInputValue] = useState(() => isoToInputValue(loadGBMDate()));
	const [saveMsg, setSaveMsg] = useState('');
	const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

	const { data: authStatus } = trpc.auth.getAuthStatus.useQuery();
	const isAdmin = authStatus?.isAdmin ?? false;

	// Countdown tick — re-runs whenever gbmDate changes
	useEffect(() => {
		if (intervalRef.current) clearInterval(intervalRef.current);
		const target = new Date(gbmDate).getTime();
		setTimeLeft(calcTimeLeft(target));
		intervalRef.current = setInterval(() => setTimeLeft(calcTimeLeft(target)), 1000);
		return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
	}, [gbmDate]);

	const handleSave = () => {
		if (!inputValue) return;
		const newIso = new Date(inputValue).toISOString();
		saveGBMDate(newIso);
		setGbmDate(newIso);
		setInputValue(isoToInputValue(newIso));
		setIsEditing(false);
		setSaveMsg('✓ Saved');
		setTimeout(() => setSaveMsg(''), 3000);
	};

	const handleCancel = () => {
		setInputValue(isoToInputValue(gbmDate));
		setIsEditing(false);
	};

	return (
		<div className="w-full h-fit mx-auto bg-transparent drop-shadow-none p-4 sm:p-10 lg:p-20 rounded-sm overflow-hidden content-center relative">
			<Image
				src="/gbms/gbmgif.gif"
				alt="Photo"
				fill
				className="opacity-50 -z-10 object-cover object-center rounded-sm"
				priority
			/>

			<div className="flex flex-col lg:flex-row flex-wrap justify-between items-center gap-8">

				{/* ── Left: countdown ── */}
				<div className="flex flex-col w-full lg:w-1/2 items-center justify-center text-center py-4">
					<div className="p-4 w-full">
						<h2 className="text-4xl text-white font-[subheading-font]">
							NEXT GENERAL BODY MEETING
						</h2>
						<p className="mt-2 text-2xl text-white font-[body-font]">
							Join IEEE @ UCF for the upcoming GBM in Room TBD!
						</p>

						{/* Admin-only date editor */}
						{isAdmin && (
							<div className="mt-4">
								{!isEditing ? (
									<div className="flex flex-wrap items-center justify-center gap-3">
										<span className="text-sm text-gray-400 font-[body-font]">
											{new Date(gbmDate).toLocaleString('en-US', {
												month: 'long', day: 'numeric', year: 'numeric',
												hour: 'numeric', minute: '2-digit', timeZoneName: 'short',
											})}
										</span>
										<button
											onClick={() => setIsEditing(true)}
											className="text-xs font-[heading-font] px-3 py-1 rounded border border-[var(--ieee-bright-yellow)] text-[var(--ieee-bright-yellow)] hover:bg-[var(--ieee-bright-yellow)] hover:text-black transition-all cursor-pointer"
										>
											EDIT DATE
										</button>
										{saveMsg && (
											<span className="text-xs text-green-400 font-[body-font]">{saveMsg}</span>
										)}
									</div>
								) : (
									<div className="flex flex-col sm:flex-row items-center justify-center gap-2 mt-2">
										<input
											type="datetime-local"
											value={inputValue}
											onChange={(e) => setInputValue(e.target.value)}
											className="bg-black border border-white/30 text-white text-sm rounded px-3 py-2 font-[body-font] focus:outline-none focus:border-[var(--ieee-bright-yellow)]"
										/>
										<div className="flex gap-2">
											<button
												onClick={handleSave}
												className="text-xs font-[heading-font] px-3 py-2 rounded bg-[var(--ieee-bright-yellow)] text-black hover:opacity-90 transition-all cursor-pointer"
											>
												SAVE
											</button>
											<button
												onClick={handleCancel}
												className="text-xs font-[heading-font] px-3 py-2 rounded border border-white/30 text-white hover:border-white transition-all cursor-pointer"
											>
												CANCEL
											</button>
										</div>
									</div>
								)}
							</div>
						)}
					</div>

					{/* Countdown digits — always shows numbers, freezes at 00 when past */}
					<div className="p-3 m-3 rounded-sm border-1 backdrop-blur-lg w-full h-fit">
						<div className="flex justify-around items-center flex-row">
							{([
								{ value: timeLeft.days, label: 'DAYS' },
								{ value: timeLeft.hours, label: 'HOURS' },
								{ value: timeLeft.minutes, label: 'MINUTES' },
								{ value: timeLeft.seconds, label: 'SECONDS' },
							] as const).map((unit, i, arr) => (
								<React.Fragment key={unit.label}>
									<div className="text-white text-center">
										<span className="font-[heading-font] text-5xl">{pad(unit.value)}</span>
										<br />
										<span className="text-sm text-white font-[body-font]">{unit.label}</span>
									</div>
									{i < arr.length - 1 && (
										<span className="font-[subheading-font] text-white text-3xl">:</span>
									)}
								</React.Fragment>
							))}
						</div>
					</div>
				</div>

				{/* ── Right: calendar ── */}
				<div className="border-1 border-white w-full lg:w-5/12 rounded-sm px-2 py-4">
					<Calendar className="w-full h-[350px] sm:h-[400px] lg:h-[400px] opacity-87" />
				</div>
			</div>
		</div>
	);
};

export { Timer };