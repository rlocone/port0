import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const LAT = 30.4383;
const LON = -84.2807;
const CITY = 'Tallahassee, FL';

const WMO_CODES: Record<number, { description: string; icon: string }> = {
  0: { description: 'clear sky', icon: '01d' },
  1: { description: 'mainly clear', icon: '01d' },
  2: { description: 'partly cloudy', icon: '02d' },
  3: { description: 'overcast', icon: '04d' },
  45: { description: 'foggy', icon: '50d' },
  48: { description: 'rime fog', icon: '50d' },
  51: { description: 'light drizzle', icon: '09d' },
  53: { description: 'moderate drizzle', icon: '09d' },
  55: { description: 'dense drizzle', icon: '09d' },
  56: { description: 'light freezing drizzle', icon: '09d' },
  57: { description: 'dense freezing drizzle', icon: '09d' },
  61: { description: 'slight rain', icon: '10d' },
  63: { description: 'moderate rain', icon: '10d' },
  65: { description: 'heavy rain', icon: '10d' },
  66: { description: 'light freezing rain', icon: '10d' },
  67: { description: 'heavy freezing rain', icon: '10d' },
  71: { description: 'slight snow', icon: '13d' },
  73: { description: 'moderate snow', icon: '13d' },
  75: { description: 'heavy snow', icon: '13d' },
  77: { description: 'snow grains', icon: '13d' },
  80: { description: 'slight rain showers', icon: '09d' },
  81: { description: 'moderate rain showers', icon: '09d' },
  82: { description: 'violent rain showers', icon: '09d' },
  85: { description: 'slight snow showers', icon: '13d' },
  86: { description: 'heavy snow showers', icon: '13d' },
  95: { description: 'thunderstorm', icon: '11d' },
  96: { description: 'thunderstorm with slight hail', icon: '11d' },
  99: { description: 'thunderstorm with heavy hail', icon: '11d' },
};

const FALLBACK = { description: 'clear', icon: '01d' };

export async function GET() {
  try {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}` +
      `&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m` +
      `&temperature_unit=fahrenheit&wind_speed_unit=mph`,
      { cache: 'no-store' }
    );

    if (!response.ok) {
      throw new Error(`Open-Meteo returned ${response.status}`);
    }

    const data = await response.json();
    const current = data.current;
    const weatherCode = current.weather_code as number;
    const weather = WMO_CODES[weatherCode] ?? FALLBACK;

    return NextResponse.json({
      temp: current.temperature_2m,
      feels_like: current.apparent_temperature,
      humidity: current.relative_humidity_2m,
      wind_speed: current.wind_speed_10m,
      description: weather.description,
      icon: weather.icon,
      city: CITY,
    });
  } catch (error) {
    console.error('Weather API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch weather data' },
      { status: 502 }
    );
  }
}