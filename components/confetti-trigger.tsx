'use client';

import { useEffect } from 'react';
import confetti from 'canvas-confetti';

export default function ConfettiTrigger() {
  useEffect(() => {
    // Fire confetti immediately
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    // Romantic pink and red colors
    const colors = ['#4a0010', '#c9748a', '#f5c6d0', '#ff003c'];

    (function frame() {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  }, []);

  return null;
}
