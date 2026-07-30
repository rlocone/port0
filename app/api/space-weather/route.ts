import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

function kpToGScale(kp: number): { label: string; level: number; color: string } {
  if (kp >= 9) return { label: 'G5 — Extreme', level: 5, color: '#ff0000' };
  if (kp >= 8) return { label: 'G4 — Severe', level: 4, color: '#ff4444' };
  if (kp >= 7) return { label: 'G3 — Strong', level: 3, color: '#ff8800' };
  if (kp >= 6) return { label: 'G2 — Moderate', level: 2, color: '#ffcc00' };
  if (kp >= 5) return { label: 'G1 — Minor', level: 1, color: '#aaff00' };
  return { label: 'G0 — Quiet', level: 0, color: '#00ff88' };
}

interface KpReading {
  time_tag: string;
  kp_index?: number;
  estimated_kp?: number;
  kp?: string;
}

interface HistoricalKp {
  time_tag: string;
  Kp: number;
  a_running: number;
}

export async function GET() {
  try {
    const [kpRealtimeRes, kpHistoricalRes, electronRes] = await Promise.all([
      fetch('https://services.swpc.noaa.gov/json/planetary_k_index_1m.json', {
        cache: 'no-store',
        signal: AbortSignal.timeout(8000),
      }),
      fetch('https://services.swpc.noaa.gov/products/noaa-planetary-k-index.json', {
        cache: 'no-store',
        signal: AbortSignal.timeout(8000),
      }),
      fetch('https://services.swpc.noaa.gov/json/goes/primary/differential-electrons-1-day.json', {
        cache: 'no-store',
        signal: AbortSignal.timeout(8000),
      }),
    ]);

    const kpRealtime = kpRealtimeRes.ok ? (await kpRealtimeRes.json() as KpReading[]) : [];
    const kpHistorical = kpHistoricalRes.ok ? (await kpHistoricalRes.json() as HistoricalKp[]) : [];
    const electronFlux = electronRes.ok ? (await electronRes.json() as any[]) : [];

    const latest = kpRealtime.length > 0 ? kpRealtime[kpRealtime.length - 1] : null;
    const currentKp = latest?.estimated_kp ?? latest?.kp_index ?? 0;
    const gScale = kpToGScale(currentKp);

    const history = kpHistorical.slice(-16).map((h) => ({
      time: h.time_tag,
      kp: h.Kp,
    }));

    const last24h = kpHistorical.slice(-8);
    const maxKp24h = last24h.length > 0
      ? Math.max(...last24h.map((h) => h.Kp))
      : currentKp;
    const maxGScale = kpToGScale(maxKp24h);

    const recentElectrons = electronFlux
      .filter((e: any) => e.energy === '79 keV')
      .slice(-12);

    const avgElectronFlux = recentElectrons.length > 0
      ? Math.round(recentElectrons.reduce((s: number, e: any) => s + e.flux, 0) / recentElectrons.length)
      : 0;

    let stormSummary: string;
    if (currentKp < 5) stormSummary = 'Quiet — no geomagnetic storm in progress';
    else if (currentKp < 6) stormSummary = 'G1 Minor storm — weak grid fluctuations, minor satellite impact';
    else if (currentKp < 7) stormSummary = 'G2 Moderate storm — possible aurora at lower latitudes, HF radio fade';
    else if (currentKp < 8) stormSummary = 'G3 Strong storm — aurora visible to FL/TX, voltage corrections possible';
    else if (currentKp < 9) stormSummary = 'G4 Severe storm — widespread voltage problems, aurora to deep south';
    else stormSummary = 'G5 Extreme — widespread grid damage possible, aurora to equator';

    return NextResponse.json({
      currentKp: Math.round(currentKp * 100) / 100,
      gScale: gScale.label,
      gLevel: gScale.level,
      maxKp24h: Math.round(maxKp24h * 100) / 100,
      maxGScale24h: maxGScale.label,
      maxGLevel24h: maxGScale.level,
      history,
      stormSummary,
      electronFlux: {
        current: avgElectronFlux,
        unit: 'pfu (79 keV)',
        status: avgElectronFlux > 10000 ? 'Elevated' : avgElectronFlux > 1000 ? 'Moderate' : 'Normal',
      },
      updated: latest?.time_tag ?? new Date().toISOString(),
    });
  } catch (error) {
    console.error('Space weather API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch space weather data' },
      { status: 502 }
    );
  }
}