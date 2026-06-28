'use client';

import { useEffect, useState } from 'react';

interface CountdownProps {
  targetDateString: string;
}

export default function Countdown({ targetDateString }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);

  useEffect(() => {
    const runSeconds = () => {
      const now = Date.now();
      let referenceTime = new Date(targetDateString).getTime();
      
      // Fallback if date parsing fails
      if (isNaN(referenceTime)) {
        referenceTime = now;
      }

      const threeDaysMs = 3 * 24 * 60 * 60 * 1000;
      let diff = 0;

      if (referenceTime > now) {
        // If target is in the future, count down to the nearest 3-day cycle boundary
        diff = (referenceTime - now) % threeDaysMs;
      } else {
        // If target is in the past, count down to the next 3-day rollover
        diff = threeDaysMs - ((now - referenceTime) % threeDaysMs);
      }

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };

    runSeconds();
    const interval = setInterval(runSeconds, 1000);

    return () => clearInterval(interval);
  }, [targetDateString]);

  if (!timeLeft) {
    return (
      <div className="grid grid-cols-4 gap-2 text-center max-w-sm mx-auto animate-pulse">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-romantic-card/80 border border-romantic-border p-2 rounded-xl">
            <span className="block text-2xl font-bold text-romantic-rosegold">00</span>
            <span className="text-xs text-romantic-pink">...</span>
          </div>
        ))}
      </div>
    );
  }

  const items = [
    { label: 'يوم', value: timeLeft.days },
    { label: 'ساعة', value: timeLeft.hours },
    { label: 'دقيقة', value: timeLeft.minutes },
    { label: 'ثانية', value: timeLeft.seconds },
  ];

  return (
    <div className="grid grid-cols-4 gap-2 text-center max-w-sm mx-auto">
      {items.map((item, index) => (
        <div 
          key={index} 
          className="bg-romantic-card/90 border border-romantic-border/60 p-3 rounded-xl shadow-lg relative overflow-hidden group hover:border-romantic-rosegold/50 transition-all duration-300"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-romantic-burgundy/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <span className="block text-2xl md:text-3xl font-extrabold text-romantic-pink tracking-wider">
            {String(item.value).padStart(2, '0')}
          </span>
          <span className="text-xs text-romantic-rosegold/80 font-medium mt-1 block">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}
