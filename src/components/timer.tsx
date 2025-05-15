"use client";

import React, { useState, useEffect } from "react";

const Timer: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const countDownDate = new Date("Aug 18, 2025 00:00:00").getTime();

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
  }, []);

  return (
      <div className="max-w-lg mx-auto bg-white drop-shadow-lg  rounded-lg overflow-hidden hover:scale-102 transition">
        <div className="p-4">
          <h2 className="text-3xl font-[heading-font]">NEXT GENERAL BODY MEETING</h2>
          <p className="mt-2 text-lg text-[var(--ieee-grey)]">
            Join IEEE UCF for the upcoming GBM in HEC 101! The special guest speaker will be Larry.
          </p>
        </div>

        <div className="py-4 px-6">
          <div className="flex flex-wrap gap-4 justify-center items-center">
            <div className="rounded-lg px-4 py-2 bg-[var(--ieee-bright-yellow)]">
              <div className="font-bold font-[heading-font] text-2xl text-gray-800">
                {timeLeft.days}d
              </div>
            </div>
            <div className="rounded-lg px-4 py-2 bg-[var(--ieee-bright-yellow)]">
              <div className="font-bold font-[heading-font] text-2xl text-gray-800">
                {timeLeft.hours}h
              </div>
            </div>
            <div className="rounded-lg px-4 py-2 bg-[var(--ieee-bright-yellow)]">
              <div className="font-bold font-[heading-font] text-2xl text-gray-800">
                {timeLeft.minutes}m
              </div>
            </div>
            <div className="rounded-lg px-4 py-2 bg-[var(--ieee-bright-yellow)]">
              <div className="font-bold font-[heading-font] text-2xl text-gray-800">
                {timeLeft.seconds}s
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export { Timer };