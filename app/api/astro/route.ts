import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const LAT = 30.4383;
const LON = -84.2807;

function parseLocalDateTime(localDateTime: string, utcOffsetSeconds: number): Date {
  const [datePart, timePart = '00:00:00'] = localDateTime.split('T');
  const [year, month, day] = datePart.split('-').map(Number);
  const [hour, minute, second = '0'] = timePart.split(':');
  const utcMs = Date.UTC(
    year,
    month - 1,
    day,
    Number(hour),
    Number(minute),
    Number(second)
  ) - (utcOffsetSeconds * 1000);
  return new Date(utcMs);
}

function getMoonPhase(year: number, month: number, day: number): {
  phase: string;
  illumination: number;
  emoji: string;
  nextNewMoon: Date;
  nextFullMoon: Date;
} {
  const jd = 367 * year - Math.floor(7 * (year + Math.floor((month + 9) / 12)) / 4)
    + Math.floor(275 * month / 9) + day + 1721013.5;

  const days = jd - 2451549.5;
  const lunations = days / 29.53058867;
  const phase = lunations - Math.floor(lunations);

  const illumination = Math.round((1 - Math.cos(phase * 2 * Math.PI)) / 2 * 100);

  const phases = ['New Moon', 'Waxing Crescent', 'First Quarter', 'Waxing Gibbous',
    'Full Moon', 'Waning Gibbous', 'Last Quarter', 'Waning Crescent'];
  const idx = Math.round(phase * 8) % 8;
  const phaseName = phases[idx];

  const emojis = ['🌑', '🌒', '🌓', '🌔', '🌕', '🌖', '🌗', '🌘'];
  const emoji = emojis[idx];

  const daysToNew = (1 - phase) * 29.53058867;
  const daysToFull = phase < 0.5
    ? (0.5 - phase) * 29.53058867
    : (1.5 - phase) * 29.53058867;
  const nextNewLunation = days + daysToNew + 2451549.5;
  const nextFullLunation = days + daysToFull + 2451549.5;

  const jdToDate = (jdValue: number) => {
    const totalMinutes = 86400 * (jdValue - Math.floor(jdValue));
    const hours = Math.floor(totalMinutes / 3600);
    const minutes = Math.floor((totalMinutes % 3600) / 60);
    const seconds = Math.floor(totalMinutes % 60);

    const a = Math.floor(jdValue + 0.5);
    const b = a + 1537;
    const c = Math.floor((b - 122.1) / 365.25);
    const d = Math.floor(365.25 * c);
    const e = Math.floor((b - d) / 30.6001);
    const dayNum = b - d - Math.floor(30.6001 * e) + (jdValue + 0.5 - a);
    const m = e < 14 ? e - 1 : e - 13;
    const y = m > 2 ? c - 4716 : c - 4715;
    return new Date(y, m - 1, Math.floor(dayNum), hours, minutes, seconds);
  };

  return {
    phase: phaseName,
    illumination,
    emoji,
    nextNewMoon: jdToDate(nextNewLunation),
    nextFullMoon: jdToDate(nextFullLunation),
  };
}

function getNextSolsticeEquinox(now: Date): { name: string; date: Date; emoji: string } {
  const y = now.getFullYear();
  const events: { name: string; month: number; day: number; emoji: string }[] = [
    { name: 'March Equinox', month: 3, day: 20, emoji: '🌸' },
    { name: 'June Solstice', month: 6, day: 21, emoji: '☀️' },
    { name: 'September Equinox', month: 9, day: 22, emoji: '🍂' },
    { name: 'December Solstice', month: 12, day: 21, emoji: '❄️' },
  ];

  let next = events
    .map(e => ({
      ...e,
      date: new Date(y, e.month - 1, e.day, 12, 0, 0),
    }))
    .filter(e => e.date > now)
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  if (next.length === 0) {
    next = events.map(e => ({
      ...e,
      date: new Date(y + 1, e.month - 1, e.day, 12, 0, 0),
    }));
  }

  return next[0];
}

export async function GET() {
  try {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}` +
      `&daily=sunrise,sunset,daylight_duration,sunshine_duration,uv_index_max` +
      `&current=temperature_2m` +
      `&timezone=America/New_York&forecast_days=1`,
      { cache: 'no-store' }
    );

    if (!response.ok) {
      throw new Error(`Open-Meteo returned ${response.status}`);
    }

    const data = await response.json();
    const now = new Date();
    const daily = data.daily;
    const utcOffsetSeconds = Number(data.utc_offset_seconds ?? -14400);

    const sunriseStr = daily.sunrise[0];
    const sunsetStr = daily.sunset[0];
    const sunrise = parseLocalDateTime(sunriseStr, utcOffsetSeconds);
    const sunset = parseLocalDateTime(sunsetStr, utcOffsetSeconds);
    const daylightSec = daily.daylight_duration[0];
    const sunshineSec = daily.sunshine_duration[0];
    const uvIndex = daily.uv_index_max[0];

    const goldenHourMorning = new Date(sunrise.getTime() + 30 * 60000);
    const goldenHourEvening = new Date(sunset.getTime() - 30 * 60000);

    const dayHours = Math.floor(daylightSec / 3600);
    const dayMinutes = Math.floor((daylightSec % 3600) / 60);

    const solarNoon = new Date(sunrise.getTime() + (sunset.getTime() - sunrise.getTime()) / 2);

    const moon = getMoonPhase(now.getFullYear(), now.getMonth() + 1, now.getDate());

    const season = getNextSolsticeEquinox(now);
    const daysUntil = Math.floor((season.date.getTime() - now.getTime()) / 86400000);
    const hoursUntil = Math.floor(((season.date.getTime() - now.getTime()) % 86400000) / 3600000);

    return NextResponse.json({
      sunrise: sunrise.toISOString(),
      sunset: sunset.toISOString(),
      solarNoon: solarNoon.toISOString(),
      goldenHourMorning: goldenHourMorning.toISOString(),
      goldenHourEvening: goldenHourEvening.toISOString(),
      dayLength: {
        hours: dayHours,
        minutes: dayMinutes,
        seconds: Math.floor(daylightSec % 60),
      },
      sunshineDuration: Math.floor(sunshineSec / 60),
      uvIndex: Math.round(uvIndex * 10) / 10,
      moon: {
        phase: moon.phase,
        illumination: moon.illumination,
        emoji: moon.emoji,
        nextNewMoon: moon.nextNewMoon.toISOString(),
        nextFullMoon: moon.nextFullMoon.toISOString(),
      },
      nextSeason: {
        name: season.name,
        emoji: season.emoji,
        date: season.date.toISOString(),
        daysUntil,
        hoursUntil,
      },
    });
  } catch (error) {
    console.error('Astro API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch astro data' },
      { status: 502 }
    );
  }
}
