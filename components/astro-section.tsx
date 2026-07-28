'use client';

import { useState, useEffect } from 'react';
import { Sun, Moon, Sunrise, Sunset, Clock, Calendar, Thermometer } from 'lucide-react';

interface AstroData {
  sunrise: string;
  sunset: string;
  solarNoon: string;
  goldenHourMorning: string;
  goldenHourEvening: string;
  dayLength: { hours: number; minutes: number; seconds: number };
  sunshineDuration: number;
  uvIndex: number;
  moon: {
    phase: string;
    illumination: number;
    emoji: string;
    nextNewMoon: string;
    nextFullMoon: string;
  };
  nextSeason: {
    name: string;
    emoji: string;
    date: string;
    daysUntil: number;
    hoursUntil: number;
  };
}

function formatTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: 'America/New_York',
  });
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: 'America/New_York',
  });
}

function getNthWeekdayOfMonth(year: number, monthIndex: number, weekday: number, nth: number, hour = 2) {
  const firstOfMonth = new Date(year, monthIndex, 1, hour, 0, 0, 0);
  const firstWeekday = firstOfMonth.getDay();
  const daysUntilWeekday = (7 + weekday - firstWeekday) % 7;
  const dayOfMonth = 1 + daysUntilWeekday + (nth - 1) * 7;
  return new Date(year, monthIndex, dayOfMonth, hour, 0, 0, 0);
}

export default function AstroSection() {
  const [astro, setAstro] = useState<AstroData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAstro = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/astro');
        if (!res.ok) throw new Error('Failed to fetch astro data');
        const data = await res.json();
        setAstro(data);
      } catch (err) {
        setError('Unable to load astro data');
        console.error('Astro fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAstro();
  }, []);

  if (loading) {
    return (
      <div className="grid md:grid-cols-2 gap-6">
        <div className="glass rounded-2xl p-6 glow-orange">
          <div className="text-center text-gray-500 text-sm">Loading solar data...</div>
        </div>
        <div className="glass rounded-2xl p-6 glow-blue">
          <div className="text-center text-gray-500 text-sm">Loading lunar data...</div>
        </div>
      </div>
    );
  }

  if (error || !astro) {
    return (
      <div className="glass rounded-2xl p-6 text-center">
        <p className="text-gray-500 text-sm">{error || 'No data'}</p>
      </div>
    );
  }

  // DST transition: next spring-forward (Mar) or fall-back (Nov)
  const now = new Date();
  const year = now.getFullYear();
  // US DST: 2nd Sunday in March, 1st Sunday in November
  const dstSpring = getNthWeekdayOfMonth(year, 2, 0, 2);
  const dstFall = getNthWeekdayOfMonth(year, 10, 0, 1);

  let nextDst: { name: string; date: Date } | null = null;
  if (dstSpring > now) nextDst = { name: 'Spring Forward', date: dstSpring };
  else if (dstFall > now) nextDst = { name: 'Fall Back', date: dstFall };
  else {
    nextDst = { name: 'Spring Forward', date: getNthWeekdayOfMonth(year + 1, 2, 0, 2) };
  }

  const dstDays = Math.floor((nextDst.date.getTime() - now.getTime()) / 86400000);

  // Year 2038 problem countdown
  const y2038 = new Date(2038, 0, 19, 3, 14, 7);
  const y2038Days = Math.floor((y2038.getTime() - now.getTime()) / 86400000);

  // Sidereal time (GMST approximation)
  const jd = 367 * now.getUTCFullYear() - Math.floor(7 * (now.getUTCFullYear() + Math.floor((now.getUTCMonth() + 10) / 12)) / 4)
    + Math.floor(275 * (now.getUTCMonth() + 1) / 9) + now.getUTCDate() - 730531.5;
  const gmst = (18.697374558 + 24.06570982441908 * jd) % 24;
  const gmstH = Math.floor(gmst);
  const gmstM = Math.floor((gmst - gmstH) * 60);
  const gmstS = Math.floor(((gmst - gmstH) * 60 - gmstM) * 60);

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Solar Card */}
        <div className="glass rounded-2xl p-6 glow-orange glass-hover transition-all duration-500">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sun className="w-5 h-5 text-orange-400" />
            <span className="text-sm text-orange-300 uppercase tracking-widest">Solar</span>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-gray-400">
                <Sunrise className="w-4 h-4 text-yellow-400" />
                <span>Sunrise</span>
              </div>
              <span className="text-gray-200 font-mono">{formatTime(astro.sunrise)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-gray-400">
                <Sunset className="w-4 h-4 text-orange-400" />
                <span>Sunset</span>
              </div>
              <span className="text-gray-200 font-mono">{formatTime(astro.sunset)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-gray-400">
                <Clock className="w-4 h-4 text-purple-400" />
                <span>Solar Noon</span>
              </div>
              <span className="text-gray-200 font-mono">{formatTime(astro.solarNoon)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-gray-400">
                <Sun className="w-4 h-4 text-amber-400" />
                <span>Golden Hour</span>
              </div>
              <span className="text-gray-200 font-mono text-xs">
                {formatTime(astro.goldenHourMorning)} – {formatTime(astro.goldenHourEvening)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-white/10">
            <div className="text-center">
              <div className="text-lg font-light text-yellow-300">{astro.dayLength.hours}h {astro.dayLength.minutes}m</div>
              <div className="text-[10px] text-gray-500 uppercase tracking-wider">Day Length</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-light text-orange-300">{astro.uvIndex}</div>
              <div className="text-[10px] text-gray-500 uppercase tracking-wider">UV Index</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-light text-amber-400">{Math.round(astro.sunshineDuration / 60)}h</div>
              <div className="text-[10px] text-gray-500 uppercase tracking-wider">Sunshine</div>
            </div>
          </div>
        </div>

        {/* Lunar Card */}
        <div className="glass rounded-2xl p-6 glow-blue glass-hover transition-all duration-500">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Moon className="w-5 h-5 text-blue-400" />
            <span className="text-sm text-blue-300 uppercase tracking-widest">Lunar</span>
          </div>

          <div className="text-center mb-4">
            <span className="text-5xl">{astro.moon.emoji}</span>
          </div>
          <div className="text-center mb-1">
            <span className="text-lg text-gray-200">{astro.moon.phase}</span>
          </div>
          <div className="text-center mb-4">
            <span className="text-sm text-gray-400">{astro.moon.illumination}% illuminated</span>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Next Full Moon</span>
              <span className="text-gray-200">{formatDate(astro.moon.nextFullMoon)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Next New Moon</span>
              <span className="text-gray-200">{formatDate(astro.moon.nextNewMoon)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Second row: Season + DST + Y2038 + Sidereal */}
      <div className="grid md:grid-cols-4 gap-4">
        {/* Season Countdown */}
        <div className="glass rounded-2xl p-4 glow-green glass-hover transition-all duration-500 text-center">
          <div className="text-xl mb-1">{astro.nextSeason.emoji}</div>
          <div className="text-sm text-gray-300">{astro.nextSeason.name}</div>
          <div className="text-2xl font-light text-green-400 mt-1">{astro.nextSeason.daysUntil}</div>
          <div className="text-xs text-gray-500">days away</div>
        </div>

        {/* DST Countdown */}
        <div className="glass rounded-2xl p-4 glow-purple glass-hover transition-all duration-500 text-center">
          <div className="text-xl mb-1">{nextDst.name === 'Spring Forward' ? '⏩' : '⏪'}</div>
          <div className="text-sm text-gray-300">{nextDst.name}</div>
          <div className="text-2xl font-light text-purple-400 mt-1">{dstDays}</div>
          <div className="text-xs text-gray-500">days away</div>
        </div>

        {/* Y2038 Countdown */}
        <div className="glass rounded-2xl p-4 glow-red glass-hover transition-all duration-500 text-center">
          <div className="text-xl mb-1">💥</div>
          <div className="text-sm text-gray-300">Year 2038 Problem</div>
          <div className="text-2xl font-light text-red-400 mt-1">{y2038Days.toLocaleString()}</div>
          <div className="text-xs text-gray-500">days remaining</div>
        </div>

        {/* Sidereal Time */}
        <div className="glass rounded-2xl p-4 glow-cyan glass-hover transition-all duration-500 text-center">
          <div className="text-xl mb-1">🌌</div>
          <div className="text-sm text-gray-300">GMST</div>
          <div className="text-2xl font-light text-cyan-400 mt-1 font-mono">
            {String(gmstH).padStart(2, '0')}h {String(gmstM).padStart(2, '0')}m
          </div>
          <div className="text-xs text-gray-500">Greenwich Sidereal Time</div>
        </div>
      </div>
    </div>
  );
}