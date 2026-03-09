'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Calendar } from '@/components/calendar';

const Timer: React.FC = () => {
	const [timeLeft, setTimeLeft] = useState({
		days: 0,
		hours: 0,
		minutes: 0,
		seconds: 0,
	});

	useEffect(() => {
		fetchTimer();
	}, []);

	const fetchTimer = async () => {
		const res = await fetch('/api/times?title=GBM', { method: 'GET' });
		const timerRes = await res.json();
		const timerData = timerRes.data?.[0];
		const countDownDate = new Date(timerData.time).getTime();

		const interval = setInterval(() => {
			const now = new Date().getTime();
			const distance = countDownDate - now;

			if (distance < 0) {
				clearInterval(interval);
				return;
			}
			
			const days = Math.floor(distance / (1000 * 60 * 60 * 24));
			const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
			const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
			const seconds = Math.floor((distance % (1000 * 60)) / 1000);

			setTimeLeft({ days, hours, minutes, seconds });
		}, 1000);

		return () => clearInterval(interval);
	};

	return (
		<div className="w-full h-fit mx-auto bg-transparent drop-shadow-none p-4 sm:p-10 lg:p-20 rounded-sm overflow-hidden content-center">
			<Image
				src="/gbms/gbmgif.gif"
				alt="Photo"
				fill
				className="opacity-50 -z-10 object-cover object-center rounded-sm"
				priority
			/>
			<div className="flex flex-col lg:flex-row flex-wrap justify-between items-center gap-8">
				<div className="flex flex-col w-full lg:w-1/2 items-center justify-center text-center py-4">
					<div className="p-4 w-full">
						<h2 className="text-4xl text-white font-[subheading-font]">
							NEXT GENERAL BODY MEETING
						</h2>
						<p className="mt-2 text-2xl text-white font-[body-font]">
							Join IEEE @ UCF for the upcoming GBM in Room TBD!
						</p>
					</div>
					<div className="p-3 m-3 rounded-sm border-1 backdrop-blur-lg w-full h-fit">
						<div className="flex justify-around items-center flex-row">
							<div className="text-white">
								<span className="font-[heading-font] text-5xl">
									{timeLeft.days}
								</span>
								<br />
								<span className="text-sm text-white font-[body-font]">DAYS</span>
							</div>
							<span className="font-[subheading-font] text-white text-3xl">:</span>
							<div className="text-white">
								<span className="font-[heading-font] text-5xl">
									{timeLeft.hours}
								</span>
								<br />
								<span className="text-sm text-white font-[body-font]">HOURS</span>
							</div>
							<span className="font-[subheading-font] text-white text-3xl">:</span>
							<div className="text-white">
								<span className="font-[heading-font] text-5xl">
									{timeLeft.minutes}
								</span>
								<br />
								<span className="text-sm text-white font-[body-font]">MINUTES</span>
							</div>
							<span className="font-[subheading-font] text-white text-3xl">:</span>
							<div className="text-white">
								<span className="font-[heading-font] text-5xl">
									{timeLeft.seconds}
								</span>
								<br />
								<span className="text-sm text-white font-[body-font]">SECONDS</span>
							</div>
						</div>
					</div>
				</div>
				<div className="border-1 border-white w-full lg:w-5/12 rounded-sm px-2 py-4">
					<Calendar className="w-full h-[350px] sm:h-[400px] lg:h-[400px] opacity-87" />
				</div>
			</div>
		</div>
	);
};

export { Timer };
