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
    fetchTimer();
  }, []);

    const fetchTimer = async () => {
      const res = await fetch("/api/times?title=GBM", { method: "GET" });
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
      <div className="lg:w-5/12 w-full mx-auto bg-white drop-shadow-lg rounded-md overflow-hidden">
        <div className="p-4">
          <h2 className="text-[25px] font-[subheading-font]">NEXT GENERAL BODY MEETING</h2>
          <p className="mt-2 text-xl font-[body-font]">
            Join IEEE UCF for the upcoming GBM in HEC 101!
          </p>
        </div>

        <div className="py-4 px-6">
          <div className="flex gap-1 justify-center items-center">
            <div className="rounded-sm px-6 py-2 bg-[var(--ieee-bright-yellow)] w-1/4">
              <div className="font-bold font-[heading-font] text-2xl text-gray-800">
                {timeLeft.days}
                <br></br>
                <span className="text-sm">days</span>
              </div>
            </div>
            <div className="rounded-sm px-6 py-2 bg-[var(--ieee-bright-yellow)] w-1/4">
              <div className="font-bold font-[heading-font] text-2xl text-gray-800">
                {timeLeft.hours}
                <br></br>
                <span className="text-sm">hours</span>
              </div>
            </div>
            <div className="rounded-sm px-6 py-2 bg-[var(--ieee-bright-yellow)] w-1/4">
              <div className="font-bold font-[heading-font] text-2xl text-gray-800">
                {timeLeft.minutes}
                <br></br>
                <span className="text-sm">minutes</span>
              </div>
            </div>
            <div className="rounded-sm px-6 py-2 bg-[var(--ieee-bright-yellow)] w-1/4">
              <div className="font-bold font-[heading-font] text-2xl text-gray-800">
                {timeLeft.seconds}
                <br></br>
                <span className="text-sm">seconds</span>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export { Timer };