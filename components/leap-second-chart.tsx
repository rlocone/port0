'use client';

import { Timer, Info, Clock3, ArrowRight } from 'lucide-react';

interface LeapSecond {
  year: number;
  offset: number;
}

const LEAP_SECONDS: LeapSecond[] = [
  { year: 1972, offset: 10 }, { year: 1972, offset: 11 },
  { year: 1973, offset: 12 }, { year: 1974, offset: 13 },
  { year: 1975, offset: 14 }, { year: 1976, offset: 15 },
  { year: 1977, offset: 16 }, { year: 1978, offset: 17 },
  { year: 1979, offset: 18 },
  { year: 1981, offset: 19 }, { year: 1982, offset: 20 },
  { year: 1983, offset: 21 },
  { year: 1985, offset: 22 },
  { year: 1988, offset: 23 },
  { year: 1990, offset: 24 }, { year: 1991, offset: 25 },
  { year: 1992, offset: 26 }, { year: 1993, offset: 27 },
  { year: 1994, offset: 28 },
  { year: 1996, offset: 29 },
  { year: 1997, offset: 30 },
  { year: 1999, offset: 31 },
  { year: 2006, offset: 32 },
  { year: 2009, offset: 33 },
  { year: 2012, offset: 34 },
  { year: 2015, offset: 35 },
  { year: 2017, offset: 36 },
];

const gapText = '9.5-year gap and counting';

export default function LeapSecondChart() {
  const lastAdded = LEAP_SECONDS[LEAP_SECONDS.length - 1];

  return (
    <div className="glass rounded-2xl p-6 glow-green glass-hover transition-all duration-500 mt-6">
      <div className="flex items-center justify-center gap-2 mb-4">
        <Timer className="w-5 h-5 text-green-400" />
        <span className="text-sm text-green-300 uppercase tracking-widest">Leap Seconds</span>
        <Timer className="w-5 h-5 text-green-400" />
      </div>

      <div className="grid gap-4 md:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-2xl border border-white/5 bg-black/20 p-4">
          <div className="flex items-baseline gap-3 flex-wrap">
            <div className="text-5xl font-light text-green-300">27</div>
            <div className="text-sm text-gray-400">leap seconds inserted since 1972</div>
          </div>

          <div className="mt-5 space-y-2">
            <div className="flex items-center justify-between text-[11px] text-gray-500 uppercase tracking-[0.25em]">
              <span>UTC</span>
              <span>TAI</span>
            </div>
            <div className="relative h-3 rounded-full bg-white/5 overflow-hidden border border-white/5">
              <div className="absolute inset-y-0 left-0 w-full bg-gradient-to-r from-green-500/30 via-emerald-400/40 to-cyan-400/30" />
              <div className="absolute left-0 top-1/2 h-5 w-[2px] -translate-y-1/2 bg-green-300" />
              <div className="absolute right-0 top-1/2 h-5 w-[2px] -translate-y-1/2 bg-green-300" />
            </div>
            <div className="flex items-center justify-between text-[11px] text-gray-500">
              <span>1972</span>
              <span>2017</span>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">
            <Clock3 className="w-3 h-3 text-green-400" />
            <span>{gapText} • longest quiet stretch so far</span>
          </div>
        </div>

        <div className="grid gap-3">
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 rounded-xl bg-white/[0.02] border border-white/5">
              <div className="text-lg font-light text-green-400">27</div>
              <div className="text-[10px] text-gray-500 uppercase tracking-wider">Leap Seconds</div>
            </div>
            <div className="text-center p-3 rounded-xl bg-white/[0.02] border border-white/5">
              <div className="text-lg font-light text-green-400">+37s</div>
              <div className="text-[10px] text-gray-500 uppercase tracking-wider">UTC-TAI Offset</div>
            </div>
            <div className="text-center p-3 rounded-xl bg-white/[0.02] border border-white/5">
              <div className="text-lg font-light text-green-400">2017</div>
              <div className="text-[10px] text-gray-500 uppercase tracking-wider">Last Added</div>
            </div>
          </div>

          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4 text-sm text-gray-400 leading-relaxed">
            <div className="flex items-start gap-2">
              <Info className="w-3 h-3 mt-0.5 shrink-0 text-green-400" />
              <div>
                <p className="text-gray-300">No leap second scheduled since Jan 1, 2017.</p>
                <p className="mt-1">Source: IERS Bulletin C 71 (Jan 2026).</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3 text-xs text-gray-500">
            <span>Leap seconds keep UTC aligned with Earth&apos;s rotation.</span>
            <ArrowRight className="w-3 h-3 text-green-400" />
          </div>
        </div>
      </div>
    </div>
  );
}