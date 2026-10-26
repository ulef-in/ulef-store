import { useState, useEffect } from 'react';

const STORAGE_KEY = 'ulef_drop04_countdown_target';
const DEFAULT_WINDOW_MS = (4 * 3600 + 38 * 60 + 24) * 1000; // ~4h 38m 24s window
const EXTENSION_WINDOW_MS = 2 * 3600 * 1000; // 2-hour final extension

interface TimeRemaining {
  hours: string;
  minutes: string;
  seconds: string;
  shortText: string;
  totalSeconds: number;
  isExtension: boolean;
}

export function useDropTimer(): TimeRemaining {
  const [remaining, setRemaining] = useState<TimeRemaining>(() => {
    return computeRemaining();
  });

  function computeRemaining(): TimeRemaining {
    const now = Date.now();
    let target = 0;

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        target = parseInt(stored, 10);
      }
    } catch {
      // localStorage unavailable or restricted
    }

    let isExtension = false;

    // If no target or target has passed, handle initialization / loop extension
    if (!target || isNaN(target)) {
      target = now + DEFAULT_WINDOW_MS;
      try {
        localStorage.setItem(STORAGE_KEY, target.toString());
      } catch {
        // ignore
      }
    } else if (target <= now) {
      // Timer hit 0: Loop to 2-hour final extension
      isExtension = true;
      target = now + EXTENSION_WINDOW_MS;
      try {
        localStorage.setItem(STORAGE_KEY, target.toString());
        localStorage.setItem('ulef_drop04_is_extension', 'true');
      } catch {
        // ignore
      }
    } else {
      try {
        isExtension = localStorage.getItem('ulef_drop04_is_extension') === 'true';
      } catch {
        // ignore
      }
    }

    const diff = Math.max(0, Math.floor((target - now) / 1000));
    const hours = Math.floor(diff / 3600);
    const minutes = Math.floor((diff % 3600) / 60);
    const seconds = diff % 60;

    const pad = (n: number) => String(n).padStart(2, '0');

    return {
      hours: pad(hours),
      minutes: pad(minutes),
      seconds: pad(seconds),
      shortText: `${hours}h ${pad(minutes)}m`,
      totalSeconds: diff,
      isExtension
    };
  }

  useEffect(() => {
    // Tick every 1000ms
    const interval = setInterval(() => {
      setRemaining(computeRemaining());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return remaining;
}
