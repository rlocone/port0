import { NextResponse } from 'next/server';
import { buildEcoDashboardData } from '@/lib/eco';

export const dynamic = 'force-dynamic';

const CACHE_TTL_MS = 30_000;

let cache: { generatedAt: number; payload: Awaited<ReturnType<typeof buildEcoDashboardData>> } | null = null;
let inFlight: Promise<Awaited<ReturnType<typeof buildEcoDashboardData>>> | null = null;

async function getEcoPayload() {
  const now = Date.now();
  if (cache && now - cache.generatedAt < CACHE_TTL_MS) {
    return cache.payload;
  }

  if (!inFlight) {
    inFlight = buildEcoDashboardData().finally(() => {
      inFlight = null;
    });
  }

  const payload = await inFlight;
  cache = {
    generatedAt: now,
    payload,
  };
  return payload;
}

export async function GET() {
  try {
    const payload = await getEcoPayload();
    return NextResponse.json(payload, {
      headers: {
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=120',
      },
    });
  } catch (error) {
    console.error('Eco dashboard API error:', error);
    return NextResponse.json(
      {
        error: 'Failed to load eco dashboard data',
      },
      { status: 502 }
    );
  }
}
