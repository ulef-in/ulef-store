import React from 'react';
import { useDropTimer } from '../hooks/useDropTimer';
import { Flame, Clock } from 'lucide-react';

interface DropUrgencyTimerProps {
  className?: string;
  variant?: 'full' | 'compact' | 'badge';
}

export const DropUrgencyTimer: React.FC<DropUrgencyTimerProps> = ({
  className = '',
  variant = 'full'
}) => {
  const { hours, minutes, seconds, shortText, isExtension } = useDropTimer();

  if (variant === 'badge') {
    return (
      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-tight bg-neutral-950/85 dark:bg-neutral-900/90 text-amber-400 border border-amber-400/30 shadow-sm backdrop-blur-md ${className}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse shrink-0" />
        <span className="tabular-nums font-bold">⚡ Ends in {shortText}</span>
      </span>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-2 py-1.5 px-3 rounded-lg bg-neutral-900/80 border border-neutral-800 text-xs font-mono text-neutral-300 ${className}`}>
        <span className="relative flex h-2 w-2 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
        </span>
        <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
          50% OFF DROP CLOSES:
        </span>
        <span className="text-white font-bold tracking-wider tabular-nums font-mono">
          {hours}h : {minutes}m : {seconds}s
        </span>
      </div>
    );
  }

  return (
    <div
      className={`border border-neutral-800 bg-neutral-900/60 dark:bg-neutral-900/80 p-3 sm:p-3.5 rounded-xl backdrop-blur-sm space-y-2.5 shadow-sm ${className}`}
    >
      {/* Header: Pulsing Dot & Technical Architectural Label */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
          </span>
          <span className="text-[11px] font-mono font-extrabold uppercase tracking-widest text-neutral-100 flex items-center gap-1.5">
            {isExtension ? '● FINAL EXTENSION CUTOFF' : '● DROP 04 ARCHIVE CLOSING'}
          </span>
        </div>

        <span className="text-[9px] font-mono uppercase tracking-widest text-amber-400/90 font-bold px-1.5 py-0.5 rounded bg-amber-400/10 border border-amber-400/20 flex items-center gap-1">
          <Flame className="w-3 h-3 text-amber-400 animate-pulse" />
          50% LAUNCH ALLOCATION
        </span>
      </div>

      {/* Digits Display: Clean Monospace Block Grid (Zero Layout Shift) */}
      <div className="flex items-center justify-between gap-1.5 sm:gap-2">
        {/* Hours Block */}
        <div className="flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-lg bg-neutral-950/90 border border-neutral-800/80">
          <span className="text-lg sm:text-xl font-bold font-mono tracking-wider text-white tabular-nums min-w-[2ch] text-center">
            {hours}
          </span>
          <span className="text-[9px] font-mono uppercase tracking-widest text-neutral-400 mt-0.5">
            Hours
          </span>
        </div>

        <span className="text-base font-bold font-mono text-neutral-500 select-none pb-3">:</span>

        {/* Minutes Block */}
        <div className="flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-lg bg-neutral-950/90 border border-neutral-800/80">
          <span className="text-lg sm:text-xl font-bold font-mono tracking-wider text-white tabular-nums min-w-[2ch] text-center">
            {minutes}
          </span>
          <span className="text-[9px] font-mono uppercase tracking-widest text-neutral-400 mt-0.5">
            Mins
          </span>
        </div>

        <span className="text-base font-bold font-mono text-neutral-500 select-none pb-3">:</span>

        {/* Seconds Block */}
        <div className="flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-lg bg-neutral-950/90 border border-neutral-800/80">
          <span className="text-lg sm:text-xl font-bold font-mono tracking-wider text-amber-400 tabular-nums min-w-[2ch] text-center">
            {seconds}
          </span>
          <span className="text-[9px] font-mono uppercase tracking-widest text-neutral-400 mt-0.5">
            Secs
          </span>
        </div>
      </div>

      {/* Micro Status Footnote */}
      <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400 pt-0.5">
        <span className="flex items-center gap-1 text-neutral-400">
          <Clock className="w-3 h-3 text-neutral-500" />
          <span>Tier pricing resets to ₹1,999 upon countdown expiration</span>
        </span>
        <span className="text-emerald-400 font-bold shrink-0">Live Allocation Active</span>
      </div>
    </div>
  );
};
