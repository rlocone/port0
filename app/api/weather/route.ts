import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const LAT = 30.4383;
const LON = -84.2807;
const CITY = 'Tallahassee';
const STATE = 'FL';

function codeToWeather(code: number | undefined) {
  switch (code) {
    case 0:
      return { description: 'clear sky', icon: '01d' };
    case 1:
    case 2:
      return { description: 'partly cloudy', icon: '02d' };
    case 3:
      return { description: 'overcast', icon: '04d' };
    case 45:
    case 48:
      return { description: 'fog', icon: '50d' };
    case 51:
    case 53:
    case 55:
    case 56:
    case 57:
      return { description: 'drizzle', icon: '09d' };
    case 61:
    case 63:
    case 65:
    case 66:
    case 67:
      return { description: 'rain', icon: '10d' };
    case 71:
    case 73:
    case 75:
    case 77:
      return { description: 'snow', icon: '13d' };
    case 80:
    case 81:
    case 82:
      return { description: 'showers', icon: '09d' };
    case 95:
    case 96:
    case 99:
      return { description: 'thunderstorm', icon: '11d' };
    default:
      return { description: 'partly cloudy', icon: '02d' };
  }
}

function buildMockWeather() {
  return {
    temp: 72,
    feels_like: 70,
    humidity: 65,
    wind_speed: 8,
    dewpoint: 62,
    cape: 0,
    description: 'partly cloudy',
    icon: '02d',
    city: `${CITY}, ${STATE}`,
  };
}

export async function GET() {
  try {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}` +
      `&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code,dew_point_2m,cape` +
      `&temperature_unit=fahrenheit&windspeed_unit=mph&timezone=America/New_York&forecast_days=1`,
      { cache: 'no-store' }
    );

    if (!response.ok) {
      return NextResponse.json(buildMockWeather());
    }

    const data = await response.json();
    const current = data?.current ?? {};
    const weather = codeToWeather(current?.weather_code);

    return NextResponse.json({
      temp: current?.temperature_2m ?? 72,
      feels_like: current?.apparent_temperature ?? 70,
      humidity: current?.relative_humidity_2m ?? 65,
      wind_speed: current?.wind_speed_10m ?? 8,
      dewpoint: current?.dew_point_2m ?? 62,
      cape: current?.cape ?? 0,
      description: weather.description,
      icon: weather.icon,
      city: `${CITY}, ${STATE}`,
    });
  } catch (error) {
    console?.error?.('Weather API error:', error);
    return NextResponse.json(buildMockWeather());
  }
}
