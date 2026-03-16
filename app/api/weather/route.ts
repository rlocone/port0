import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const apiKey = process?.env?.OPENWEATHERMAP_API_KEY ?? '';
  const city = 'Tallahassee';
  const state = 'FL';
  const country = 'US';

  if (!apiKey) {
    // Return mock data if no API key
    return NextResponse.json({
      temp: 72,
      feels_like: 70,
      humidity: 65,
      wind_speed: 8,
      description: 'partly cloudy',
      icon: '02d',
      city: `${city}, ${state}`,
    });
  }

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city},${state},${country}&appid=${apiKey}&units=imperial`,
      { cache: 'no-store' }
    );

    if (!response?.ok) {
      // Return mock data on API error
      return NextResponse.json({
        temp: 72,
        feels_like: 70,
        humidity: 65,
        wind_speed: 8,
        description: 'partly cloudy',
        icon: '02d',
        city: `${city}, ${state}`,
      });
    }

    const data = await response?.json?.();

    return NextResponse.json({
      temp: data?.main?.temp ?? 72,
      feels_like: data?.main?.feels_like ?? 70,
      humidity: data?.main?.humidity ?? 65,
      wind_speed: data?.wind?.speed ?? 8,
      description: data?.weather?.[0]?.description ?? 'partly cloudy',
      icon: data?.weather?.[0]?.icon ?? '02d',
      city: `${city}, ${state}`,
    });
  } catch (error) {
    console?.error?.('Weather API error:', error);
    // Return mock data on any error
    return NextResponse.json({
      temp: 72,
      feels_like: 70,
      humidity: 65,
      wind_speed: 8,
      description: 'partly cloudy',
      icon: '02d',
      city: `${city}, ${state}`,
    });
  }
}
