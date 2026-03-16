'use client';

import { useState, useEffect } from 'react';
import { Clock, Timer, Calendar, Hash, PieChart } from 'lucide-react';

export default function DigitalClock() {
  const [mounted, setMounted] = useState(false);
  const [time, setTime] = useState<Date | null>(null);
  const [unixTime, setUnixTime] = useState<number>(0);

  useEffect(() => {
    setMounted(true);
    const now = new Date();
    setTime(now);
    setUnixTime(Math.floor(now.getTime() / 1000));
    
    const timer = setInterval(() => {
      const current = new Date();
      setTime(current);
      setUnixTime(Math.floor(current.getTime() / 1000));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const getTimezoneInfo = () => {
    if (!time) return { name: '---', offset: '---' };
    
    const timezoneName = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const offsetMinutes = time.getTimezoneOffset();
    const offsetHours = Math.floor(Math.abs(offsetMinutes) / 60);
    const offsetMins = Math.abs(offsetMinutes) % 60;
    const offsetSign = offsetMinutes <= 0 ? '+' : '-';
    const offsetStr = `UTC${offsetSign}${offsetHours.toString().padStart(2, '0')}:${offsetMins.toString().padStart(2, '0')}`;
    
    return { name: timezoneName, offset: offsetStr };
  };

  const formatTime = (date: Date | null) => {
    if (!date) return { hours: '--', minutes: '--', seconds: '--', period: '--', date: '---' };
    
    const hours = date?.getHours?.() ?? 0;
    const minutes = date?.getMinutes?.() ?? 0;
    const seconds = date?.getSeconds?.() ?? 0;
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    
    return {
      hours: displayHours?.toString?.()?.padStart?.(2, '0') ?? '00',
      minutes: minutes?.toString?.()?.padStart?.(2, '0') ?? '00',
      seconds: seconds?.toString?.()?.padStart?.(2, '0') ?? '00',
      period,
      date: date?.toLocaleDateString?.('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) ?? ''
    };
  };

  const formatUTCTime = (date: Date | null) => {
    if (!date) return { hours: '--', minutes: '--', seconds: '--', period: '--' };
    
    const hours = date?.getUTCHours?.() ?? 0;
    const minutes = date?.getUTCMinutes?.() ?? 0;
    const seconds = date?.getUTCSeconds?.() ?? 0;
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    
    return {
      hours: displayHours?.toString?.()?.padStart?.(2, '0') ?? '00',
      minutes: minutes?.toString?.()?.padStart?.(2, '0') ?? '00',
      seconds: seconds?.toString?.()?.padStart?.(2, '0') ?? '00',
      period
    };
  };

  const { hours, minutes, seconds, period, date } = formatTime(time);
  const { hours: utcHours, minutes: utcMinutes, seconds: utcSeconds, period: utcPeriod } = formatUTCTime(time);
  const { name: timezoneName, offset: timezoneOffset } = getTimezoneInfo();

  // Calculate week number (ISO 8601)
  const getWeekNumber = (d: Date | null): number => {
    if (!d) return 0;
    const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    date.setUTCDate(date.getUTCDate() + 4 - (date.getUTCDay() || 7));
    const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
    return Math.ceil((((date.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  };

  // Calculate day of year
  const getDayOfYear = (d: Date | null): number => {
    if (!d) return 0;
    const start = new Date(d.getFullYear(), 0, 0);
    const diff = d.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
  };

  // Calculate quarter
  const getQuarter = (d: Date | null): number => {
    if (!d) return 0;
    return Math.floor(d.getMonth() / 3) + 1;
  };

  const weekNumber = getWeekNumber(time);
  const dayOfYear = getDayOfYear(time);
  const quarter = getQuarter(time);

  if (!mounted) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Local Time Widget Skeleton */}
        <div className="glass rounded-2xl p-8 glow-purple">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Clock className="w-6 h-6 text-purple-400" />
            <span className="text-sm text-purple-300 uppercase tracking-widest">Browser Time</span>
          </div>
          <div className="text-5xl md:text-6xl font-light tracking-wider gradient-text text-center">
            --:--:--
          </div>
          <div className="text-sm text-gray-400 mt-4 text-center">Loading...</div>
        </div>
        {/* Unix Time Widget Skeleton */}
        <div className="glass rounded-2xl p-8 glow-cyan">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Timer className="w-6 h-6 text-cyan-400" />
            <span className="text-sm text-cyan-300 uppercase tracking-widest">Unix Timestamp</span>
          </div>
          <div className="text-5xl md:text-6xl font-mono text-center text-cyan-400 tracking-wider">
            ----------
          </div>
          <div className="text-sm text-gray-400 mt-4 text-center">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Local Time Widget */}
      <div className="glass rounded-2xl p-8 glow-purple glass-hover transition-all duration-500">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Clock className="w-6 h-6 text-purple-400" />
          <span className="text-sm text-purple-300 uppercase tracking-widest">Browser Time</span>
        </div>
        <div className="flex items-baseline justify-center gap-3 flex-wrap">
          <div className="flex items-baseline">
            <span className="text-4xl md:text-5xl font-light tracking-wider text-purple-200">{hours}:{minutes}</span>
            <span className="text-lg ml-1 text-purple-400">{period}</span>
            <span className="text-xs ml-2 text-gray-500 uppercase">local</span>
          </div>
          <span className="text-4xl md:text-5xl font-thin text-white/15">|</span>
          <div className="flex items-baseline">
            <span className="text-4xl md:text-5xl font-light tracking-wider text-cyan-300">{utcHours}:{utcMinutes}</span>
            <span className="text-lg ml-1 text-cyan-400">{utcPeriod}</span>
            <span className="text-xs ml-2 text-gray-500 uppercase">utc</span>
          </div>
        </div>
        <div className="text-sm text-gray-400 mt-4 text-center">{date}</div>
        
        {/* Timezone Info */}
        <div className="border-t border-white/10 pt-4 mt-4">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-gray-500">Timezone:</span>
              <span className="text-purple-300 font-medium">{timezoneName}</span>
            </div>
            <div className="hidden sm:block text-gray-600">•</div>
            <div className="flex items-center gap-2">
              <span className="text-gray-500">Offset:</span>
              <span className="text-cyan-400 font-mono">{timezoneOffset}</span>
            </div>
          </div>
        </div>

        {/* Stats Grid - Week, Day of Year, Quarter */}
        <div className="grid grid-cols-3 gap-3 mt-4">
          <div className="text-center p-3 rounded-xl bg-white/[0.02] border border-white/5">
            <div className="text-2xl font-light text-purple-300">{weekNumber}</div>
            <div className="text-[10px] text-gray-500 uppercase tracking-wider mt-1">Week</div>
          </div>
          <div className="text-center p-3 rounded-xl bg-white/[0.02] border border-white/5">
            <div className="text-2xl font-light text-cyan-400">{dayOfYear}</div>
            <div className="text-[10px] text-gray-500 uppercase tracking-wider mt-1">Day of Year</div>
          </div>
          <div className="text-center p-3 rounded-xl bg-white/[0.02] border border-white/5">
            <div className="text-2xl font-light text-green-400">Q{quarter}</div>
            <div className="text-[10px] text-gray-500 uppercase tracking-wider mt-1">Quarter</div>
          </div>
        </div>
      </div>

      {/* Unix Timestamp Widget */}
      <div className="glass rounded-2xl p-8 glow-cyan glass-hover transition-all duration-500">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Timer className="w-6 h-6 text-cyan-400" />
          <span className="text-sm text-cyan-300 uppercase tracking-widest">Unix Timestamp</span>
        </div>
        <div className="text-4xl md:text-5xl font-mono text-center text-cyan-400 tracking-wider">
          {unixTime}
        </div>
        <div className="text-sm text-gray-400 mt-4 text-center">Seconds since January 1, 1970</div>
        
        {/* Additional Unix Info */}
        <div className="border-t border-white/10 pt-4 mt-4">
          <div className="flex flex-col items-center gap-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-gray-500">Milliseconds:</span>
              <span className="text-cyan-300 font-mono">{time ? time.getTime() : 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
