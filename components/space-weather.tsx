'use client';

import { useState, useEffect } from 'react';
import {
  Activity,
  Radio,
  Satellite,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Zap,
} from 'lucide-react';

interface SpaceWeatherData {
  currentKp: number;
  gScale: string;
  gLevel: number;
  maxKp24h: number;
  maxGScale24h: string;
  maxGLevel24h: number;
  history: { time: string; kp: number }[];
  stormSummary: string;
  electronFlux: {
    current: number;
    unit: string;
    status: string;
  };
  updated: string;
}

const G_COLORS: Record<number, string> = {
  0: 'text-green-400 border-green-500/30 glow-green',
  1: 'text-yellow-300 border-yellow-400/30 glow-yellow',
  2: 'text-amber-400 border-amber-400/30 glow-yellow',
  3: 'text-orange-400 border-orange-400/30 glow-orange',
  4: 'text-red-400 border-red-400/30 glow-red',
  5: 'text-red-500 border-red-500/30 glow-red',
};

const G_BG: Record<number, string> = {
  0: 'bg-green-500/10',
  1: 'bg-yellow-500/10',
  2: 'bg-amber-500/10',
  3: 'bg-orange-500/10',
  4: 'bg-red-500/10',
  5: 'bg-red-500/20',
};

function kpBar(kp: number) {
  const pct = Math.min((kp / 9) * 100, 100);
  let color = 'bg-green-500';
  if (kp >= 5) color = 'bg-yellow-500';
  if (kp >= 6) color = 'bg-orange-500';
  if (kp >= 7) color = 'bg-red-500';
  if (kp >= 9) color = 'bg-red-600';

  return (
    <div className="w-full h-2 rounded-full bg-white/5 mt-1 overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-1000 ${color}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
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

export default function SpaceWeather() {
  const [data, setData] = useState<SpaceWeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/space-weather');
        if (!res.ok) throw new Error('Failed to fetch');
        const d = await res.json();
        setData(d);
      } catch (err) {
        setError('Unable to load space weather');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 300000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="glass rounded-2xl p-6 glow-purple">
        <div className="text-center text-gray-500 text-sm">Loading space weather...</div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="glass rounded-2xl p-6 text-center">
        <p className="text-gray-500 text-sm">{error || 'No data'}</p>
      </div>
    );
  }

  const isStorm = data.gLevel >= 1;
  const colorClass = G_COLORS[data.gLevel] || G_COLORS[0];
  const bgClass = G_BG[data.gLevel] || G_BG[0];

  return (
    <div className="glass rounded-2xl p-6 glow-purple glass-hover transition-all duration-500">
      <div className="flex items-center justify-center gap-2 mb-5">
        <Activity className="w-5 h-5 text-purple-400" />
        <span className="text-sm text-purple-300 uppercase tracking-widest">Space Weather</span>
        <Activity className="w-5 h-5 text-purple-400" />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className={`rounded-xl p-4 border ${colorClass} ${bgClass} text-center`}>
          <div className="text-3xl font-light text-white">
            {data.currentKp.toFixed(1)}
          </div>
          <div className="text-[10px] text-gray-500 uppercase tracking-wider mt-1">Current Kp</div>
          <div className={`text-xs mt-1 ${colorClass.split(' ')[0]}`}>{data.gScale}</div>
          {isStorm ? (
            <div className="flex items-center justify-center gap-1 mt-1">
              <AlertTriangle className="w-3 h-3 text-orange-400" />
              <span className="text-[10px] text-orange-300">Storm Active</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-1 mt-1">
              <CheckCircle2 className="w-3 h-3 text-green-400" />
              <span className="text-[10px] text-green-300">All Quiet</span>
            </div>
          )}
          {kpBar(data.currentKp)}
        </div>

        <div className="rounded-xl p-4 bg-white/[0.02] border border-white/5 text-center">
          <div className="text-3xl font-light text-gray-200">
            {data.maxKp24h.toFixed(1)}
          </div>
          <div className="text-[10px] text-gray-500 uppercase tracking-wider mt-1">24h Max Kp</div>
          <div className={`text-xs mt-1 ${G_COLORS[data.maxGLevel24h].split(' ')[0]}`}>{data.maxGScale24h}</div>
          {kpBar(data.maxKp24h)}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="rounded-xl p-3 bg-white/[0.02] border border-white/5">
          <div className="flex items-center gap-2 mb-1">
            <Satellite className="w-4 h-4 text-purple-400" />
            <span className="text-[10px] text-gray-500 uppercase tracking-wider">Electron Flux</span>
          </div>
          <div className="text-lg font-light text-white">{data.electronFlux.current.toLocaleString()}</div>
          <div className="text-[10px] text-gray-500">{data.electronFlux.unit}</div>
          <div className={`text-[10px] mt-1 ${
            data.electronFlux.status === 'Elevated' ? 'text-orange-400' :
            data.electronFlux.status === 'Moderate' ? 'text-yellow-300' :
            'text-green-400'
          }`}>
            {data.electronFlux.status}
          </div>
        </div>

        <div className="rounded-xl p-3 bg-white/[0.02] border border-white/5">
          <div className="flex items-center gap-2 mb-1">
            <Radio className="w-4 h-4 text-cyan-400" />
            <span className="text-[10px] text-gray-500 uppercase tracking-wider">Status</span>
          </div>
          <div className="flex items-center gap-1 mt-2">
            {isStorm ? (
              <Zap className="w-4 h-4 text-orange-400" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-green-400" />
            )}
            <span className={`text-sm ${isStorm ? 'text-orange-300' : 'text-green-300'}`}>
              {isStorm ? 'Disturbed' : 'Nominal'}
            </span>
          </div>
          <div className="text-[10px] text-gray-500 mt-1">Updated {formatTime(data.updated)}</div>
        </div>
      </div>

      <div className="mb-3">
        <div className="flex items-center gap-1 mb-2">
          <TrendingUp className="w-3 h-3 text-gray-500" />
          <span className="text-[10px] text-gray-500 uppercase tracking-wider">48h Kp Trend</span>
        </div>
        <div className="flex items-end gap-[2px] h-12">
          {data.history.map((h, i) => {
            const height = Math.max((h.kp / 9) * 100, 8);
            let barColor = 'bg-green-500/50';
            if (h.kp >= 5) barColor = 'bg-yellow-500/50';
            if (h.kp >= 6) barColor = 'bg-orange-500/50';
            if (h.kp >= 7) barColor = 'bg-red-500/50';
            return (
              <div
                key={i}
                className={`flex-1 rounded-t-sm transition-all duration-300 ${barColor}`}
                style={{ height: `${height}%` }}
                title={`${h.time}: Kp ${h.kp}`}
              />
            );
          })}
        </div>
      </div>

      <div className="flex items-start gap-2 p-3 rounded-xl bg-white/[0.02] border border-white/5">
        <AlertTriangle className={`w-4 h-4 mt-0.5 shrink-0 ${isStorm ? 'text-orange-400' : 'text-green-400'}`} />
        <span className="text-xs text-gray-400 leading-relaxed">{data.stormSummary}</span>
      </div>

      <div className="flex items-start gap-2 mt-3 text-[10px] text-gray-500">
        <span>Data: NOAA SWPC — Kp-index, GOES electron flux</span>
      </div>
    </div>
  );
}
