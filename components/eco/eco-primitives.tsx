'use client';

import type { ReactNode } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { cn } from '@/lib/utils';
import type { MarketCardData, MetricCardData, SparkPoint, TrendTone } from '@/lib/eco-types';

const toneClasses: Record<TrendTone, string> = {
  positive: 'text-emerald-300 border-emerald-400/20 bg-emerald-500/10',
  negative: 'text-rose-300 border-rose-400/20 bg-rose-500/10',
  neutral: 'text-zinc-300 border-white/10 bg-white/5',
};

const toneStroke: Record<TrendTone, string> = {
  positive: '#34d399',
  negative: '#fb7185',
  neutral: '#a78bfa',
};

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  asOf,
  icon,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  asOf: string;
  icon: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 flex-wrap">
      <div>
        <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.35em] text-purple-300/80 mb-2">
          {icon}
          <span>{eyebrow}</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-light text-white">{title}</h2>
        {subtitle ? <p className="text-sm text-gray-400 mt-1 max-w-3xl">{subtitle}</p> : null}
      </div>
      <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-gray-300 backdrop-blur-xl">
        <span className="text-gray-500 uppercase tracking-[0.25em] text-[10px] mr-2">As of</span>
        <span className="font-mono">{asOf || '—'}</span>
      </div>
    </div>
  );
}

export function TrendPill({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: TrendTone;
}) {
  return (
    <div className={cn('flex items-center justify-between rounded-full border px-3 py-1.5 text-[11px] backdrop-blur-xl', toneClasses[tone])}>
      <span className="mr-2 text-[10px] uppercase tracking-[0.3em] opacity-70">{label}</span>
      <span className="font-mono">{value}</span>
    </div>
  );
}

export function MiniSparkline({
  points,
  tone = 'neutral',
}: {
  points: SparkPoint[];
  tone?: TrendTone;
}) {
  if (!points.length) {
    return <div className="h-12 rounded-xl bg-white/[0.02] border border-white/5" />;
  }

  return (
    <div className="h-12 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={points} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id={`spark-${tone}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={toneStroke[tone]} stopOpacity={0.28} />
              <stop offset="100%" stopColor={toneStroke[tone]} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="value"
            stroke={toneStroke[tone]}
            strokeWidth={1.8}
            fill={`url(#spark-${tone})`}
            dot={false}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function MetricCard({ card }: { card: MetricCardData }) {
  const tone = card.changeTone ?? 'neutral';
  return (
    <div className="glass rounded-2xl p-5 glass-hover transition-all duration-500 border border-white/10 bg-white/[0.03] backdrop-blur-2xl shadow-[0_10px_40px_rgba(0,0,0,0.35)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-[10px] uppercase tracking-[0.35em] text-gray-500">{card.source}</div>
          <h3 className="mt-2 text-lg font-medium text-white">{card.label}</h3>
          {card.subtitle ? <p className="text-xs text-gray-400 mt-1 leading-relaxed">{card.subtitle}</p> : null}
        </div>
        <div className={cn('rounded-full border px-3 py-1 text-[11px] font-mono', toneClasses[tone])}>
          {card.asOf || '—'}
        </div>
      </div>

      <div className="mt-4 flex items-end justify-between gap-4">
        <div>
          <div className="text-3xl md:text-4xl font-light tracking-tight text-white text-glow">{card.value}</div>
          <div className="mt-2 flex items-center gap-2 text-xs text-gray-400">
            <span>{card.changeLabel ?? 'delta'}</span>
            <span className={cn('font-mono', tone === 'positive' ? 'text-emerald-300' : tone === 'negative' ? 'text-rose-300' : 'text-gray-300')}>
              {card.changeValue ?? '—'}
            </span>
          </div>
        </div>
        <div className="w-28 shrink-0">
          <MiniSparkline points={card.sparkline} tone={tone} />
        </div>
      </div>
    </div>
  );
}

export function MarketCard({ card }: { card: MarketCardData }) {
  const firstTone = card.changePills[0]?.tone ?? 'neutral';
  return (
    <div className="glass rounded-2xl p-5 glass-hover transition-all duration-500 border border-white/10 bg-white/[0.03] backdrop-blur-2xl shadow-[0_10px_40px_rgba(0,0,0,0.35)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-[10px] uppercase tracking-[0.35em] text-gray-500">{card.symbol}</div>
          <h3 className="mt-2 text-lg font-medium text-white">{card.label}</h3>
        </div>
        <div className={cn('rounded-full border px-3 py-1 text-[11px] font-mono', card.marketState === 'OPEN' ? toneClasses.positive : card.marketState === 'AFTER-HOURS' ? toneClasses.neutral : toneClasses.negative)}>
          {card.marketState}
        </div>
      </div>

      <div className="mt-4 flex items-end justify-between gap-4">
        <div>
          <div className="text-3xl md:text-4xl font-light tracking-tight text-white text-glow">{card.price}</div>
          <div className="mt-2 text-xs text-gray-400 font-mono">{card.asOf || '—'}</div>
        </div>
        <div className="w-28 shrink-0">
          <MiniSparkline points={card.sparkline} tone={firstTone} />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-4 gap-2">
        {card.changePills.map((pill: { label: string; value: string; tone: TrendTone }) => (
          <TrendPill key={`${card.id}-${pill.label}`} label={pill.label} value={pill.value} tone={pill.tone} />
        ))}
      </div>
    </div>
  );
}

export function YieldCurveChart({
  data,
}: {
  data: Array<{ tenor: string; numericValue: number | null }>;
}) {
  const chartData = data.map((point) => ({
    tenor: point.tenor,
    value: point.numericValue,
  }));

  return (
    <div className="h-80 md:h-96 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 10, right: 20, bottom: 10, left: 0 }}>
          <CartesianGrid stroke="rgba(255,255,255,0.08)" strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="tenor" tickLine={false} axisLine={false} stroke="rgba(255,255,255,0.55)" />
          <YAxis tickLine={false} axisLine={false} stroke="rgba(255,255,255,0.55)" tickFormatter={(v) => `${v}%`} />
          <Tooltip
            contentStyle={{
              background: 'rgba(15, 10, 26, 0.9)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '16px',
              color: '#fff',
              backdropFilter: 'blur(24px)',
            }}
            labelStyle={{ color: '#c4b5fd' }}
            formatter={(value: unknown) => [`${value as number}%`, 'Yield']}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#a78bfa"
            strokeWidth={3}
            dot={{ r: 4, fill: '#c4b5fd', stroke: '#0f0a1a', strokeWidth: 2 }}
            activeDot={{ r: 6, fill: '#f8fafc' }}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
