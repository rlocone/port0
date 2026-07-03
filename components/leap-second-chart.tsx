'use client';

import { Timer, Info } from 'lucide-react';

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

const TIMELINE = [
  '1972 ┤●●        +10→+12',
  '1973 ┤●               +13',
  '1974 ┤●               +14',
  '1975 ┤●               +15',
  '1976 ┤●               +16',
  '1977 ┤●               +17',
  '1978 ┤●               +18',
  '1979 ┤●               +19',
  '1980 ┤             (none)',
  '1981 ┤●               +20',
  '1982 ┤●               +21',
  '1983 ┤●               +22',
  '1985 ┤●               +23',
  '1988 ┤●               +24',
  '1990 ┤●               +25',
  '1991 ┤●               +26',
  '1992 ┤●               +27',
  '1993 ┤●               +28',
  '1994 ┤●               +29',
  '1996 ┤●               +30',
  '1997 ┤●               +31',
  '1999 ┤●               +32',
  '2000─2005 ┤···· 7yr gap',
  '2006 ┤●               +33',
  '2009 ┤●               +34',
  '2012 ┤●               +35',
  '2015 ┤●               +36',
  '2017 ┤●               +37 ← LAST',
  '2018─2026 ┤···· 9.5yr gap',
];

export default function LeapSecondChart() {
  return (
    <div className="glass rounded-2xl p-6 glow-green glass-hover transition-all duration-500 mt-6">
      <div className="flex items-center justify-center gap-2 mb-4">
        <Timer className="w-5 h-5 text-green-400" />
        <span className="text-sm text-green-300 uppercase tracking-widest">Leap Seconds</span>
        <Timer className="w-5 h-5 text-green-400" />
      </div>

      <div className="bg-black/20 rounded-xl p-4 overflow-x-auto">
        <pre className="text-[11px] leading-tight text-green-300/80 font-mono whitespace-pre">
          {TIMELINE.join('\n')}
        </pre>
      </div>

      <div className="grid grid-cols-3 gap-3 mt-4">
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

      <div className="flex items-start gap-2 mt-3 text-xs text-gray-500">
        <Info className="w-3 h-3 mt-0.5 shrink-0" />
        <span>
          No leap second scheduled since Jan 1, 2017. 9.5-year gap and counting — longest in history.
          Source: IERS Bulletin C 71 (Jan 2026).
        </span>
      </div>
    </div>
  );
}