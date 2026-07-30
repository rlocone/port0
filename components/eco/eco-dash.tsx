'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Activity,
  ArrowLeft,
  BadgeDollarSign,
  BrainCircuit,
  CircleDollarSign,
  Clock3,
  Coins,
  LineChart as LineChartIcon,
  Landmark,
  RefreshCw,
  ShieldAlert,
  TrendingUp,
  Wallet,
  Wind,
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MetricCard, MarketCard, SectionHeader, YieldCurveChart } from '@/components/eco/eco-primitives';
import type { EcoDashboardData } from '@/lib/eco-types';
import { formatSeriesDateTime } from '@/lib/fred';

function useLiveClock() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();
    const timer = window.setInterval(tick, 1000);
    return () => window.clearInterval(timer);
  }, []);

  return now;
}

function formatClock(date: Date, timeZone: string) {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
    timeZone,
  }).format(date);
}

function formatClockDate(date: Date, timeZone: string) {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone,
  }).format(date);
}

function SkeletonCard() {
  return (
    <div className="glass rounded-2xl p-5 border border-white/10 bg-white/[0.03] backdrop-blur-2xl animate-pulse">
      <div className="h-3 w-28 rounded-full bg-white/10" />
      <div className="mt-3 h-6 w-48 rounded-full bg-white/10" />
      <div className="mt-6 h-10 w-32 rounded-full bg-white/10" />
      <div className="mt-4 h-12 rounded-xl bg-white/5" />
    </div>
  );
}

function LoadingSection({ count = 4 }: { count?: number }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
  );
}

function formatAsOf(value: string | undefined) {
  if (!value) return '—';
  try {
    return formatSeriesDateTime(value);
  } catch {
    return value;
  }
}

export default function EcoDash() {
  const now = useLiveClock();
  const [data, setData] = useState<EcoDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    let mounted = true;
    let refreshTimer: number | null = null;

    const load = async (silent = false) => {
      try {
        if (!silent) setLoading(true);
        else setRefreshing(true);
        setError(null);
        const res = await fetch('/api/eco', { cache: 'no-store' });
        if (!res.ok) throw new Error(`Failed to load Eco-Dash (${res.status})`);
        const json = (await res.json()) as EcoDashboardData;
        if (mounted) setData(json);
      } catch (err) {
        if (mounted) setError(err instanceof Error ? err.message : 'Failed to load Eco-Dash');
      } finally {
        if (mounted) {
          setLoading(false);
          setRefreshing(false);
        }
      }
    };

    const refreshNow = () => load(true);

    load();
    refreshTimer = window.setInterval(() => load(true), 60_000);

    const onVisibility = () => {
      if (document.visibilityState === 'visible') {
        refreshNow();
      }
    };

    window.addEventListener('focus', refreshNow);
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      mounted = false;
      if (refreshTimer !== null) window.clearInterval(refreshTimer);
      window.removeEventListener('focus', refreshNow);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  const marketAsOf = data?.marketStatus.asOf ?? data?.generatedAt ?? '';

  const utcNow = useMemo(() => formatClock(now, 'UTC'), [now]);
  const localNow = useMemo(() => formatClock(now, Intl.DateTimeFormat().resolvedOptions().timeZone), [now]);
  const localDate = useMemo(() => formatClockDate(now, Intl.DateTimeFormat().resolvedOptions().timeZone), [now]);

  const loadingMacro = loading && !data;

  return (
    <main className="min-h-screen relative z-10">
      <div className="max-w-7xl mx-auto px-4 pb-14 space-y-8">
        <header className="pt-8">
          <div className="flex items-center justify-between gap-4 flex-wrap mb-6">
            <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Portal</span>
            </Link>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-gray-300 backdrop-blur-xl">
              <RefreshCw className={refreshing ? 'w-4 h-4 animate-spin text-purple-300' : 'w-4 h-4 text-purple-300'} />
              <span>{refreshing ? 'Refreshing live data' : 'Live dashboard'}</span>
            </div>
          </div>

          <div className="glass rounded-3xl p-6 md:p-8 border border-white/10 bg-white/[0.03] backdrop-blur-3xl glow-purple">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/10 px-3 py-1 text-[10px] uppercase tracking-[0.35em] text-purple-200">
                  <CircleDollarSign className="w-3.5 h-3.5" />
                  Eco-Dash
                </div>
                <div>
                  <h1 className="text-4xl md:text-5xl font-light text-white text-glow">Real-Time Economic Indicators</h1>
                  <p className="mt-2 max-w-3xl text-sm md:text-base text-gray-400">
                    A live macro, rates, market, commodities, and currency console built to match the portal&apos;s ethereal glass system.
                  </p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[34rem]">
                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-xl">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-gray-500">
                    <Clock3 className="w-4 h-4 text-cyan-300" />
                    Local Time
                  </div>
                  <div className="mt-3 text-2xl font-light text-white font-mono tracking-wide">{localNow}</div>
                  <div className="mt-1 text-xs text-gray-400">{localDate}</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-xl">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-gray-500">
                    <Clock3 className="w-4 h-4 text-purple-300" />
                    UTC
                  </div>
                  <div className="mt-3 text-2xl font-light text-white font-mono tracking-wide">{utcNow}</div>
                  <div className="mt-1 text-xs text-gray-400">Global coordination clock</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-xl">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-gray-500">
                    <BadgeDollarSign className="w-4 h-4 text-emerald-300" />
                    Market Session
                  </div>
                  <div className="mt-3 text-2xl font-light text-white font-mono tracking-wide">{data?.marketStatus.label ?? '—'}</div>
                  <div className="mt-1 text-xs text-gray-400">Last refresh {formatAsOf(data?.generatedAt)}</div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3 text-sm">
              <div className={data?.marketStatus.isOpen ? 'inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-4 py-2 text-emerald-200' : 'inline-flex items-center gap-2 rounded-full border border-rose-400/20 bg-rose-500/10 px-4 py-2 text-rose-200'}>
                <span className={data?.marketStatus.isOpen ? 'h-2 w-2 rounded-full bg-emerald-400 animate-pulse' : 'h-2 w-2 rounded-full bg-rose-400'} />
                <span>{data?.marketStatus.isOpen ? 'U.S. market open' : 'U.S. market closed'}</span>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-gray-300">
                <RefreshCw className="w-4 h-4 text-purple-300" />
                <span>Market refresh every 60s · FRED data cached server-side for 30s</span>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-gray-300">
                <Landmark className="w-4 h-4 text-cyan-300" />
                <span>As of {formatAsOf(marketAsOf)}</span>
              </div>
            </div>
          </div>
        </header>

        {error ? (
          <div className="glass rounded-2xl p-6 border border-rose-400/20 bg-rose-500/10 text-rose-100">
            <div className="flex items-center gap-2 font-medium">
              <ShieldAlert className="w-5 h-5" />
              Eco-Dash load error
            </div>
            <p className="mt-2 text-sm text-rose-100/80">{error}</p>
          </div>
        ) : null}

        <section className="space-y-5">
          <SectionHeader
            eyebrow="Macro Snapshot"
            title="Growth, inflation, labor, policy, and the long bond"
            subtitle="Top-line indicators with live sparklines and terse status deltas."
            asOf={data?.macro.asOf ?? '—'}
            icon={<TrendingUp className="w-4 h-4 text-purple-300" />}
          />
          {loadingMacro ? (
            <LoadingSection count={5} />
          ) : (
            <div className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-5">
              {data?.macro.cards.map((card) => <MetricCard key={card.id} card={card} />)}
            </div>
          )}
        </section>

        <section className="space-y-5">
          <SectionHeader
            eyebrow="National Debt & Demographics"
            title="Debt stock, debt burden, residents, and the deficit pulse"
            subtitle="Debt-to-GDP and debt-per-capita are derived directly from the live debt and population series."
            asOf={data?.debt.asOf ?? '—'}
            icon={<Wallet className="w-4 h-4 text-cyan-300" />}
          />
          {loadingMacro ? (
            <LoadingSection count={5} />
          ) : (
            <div className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-5">
              {data?.debt.cards.map((card) => <MetricCard key={card.id} card={card} />)}
            </div>
          )}
        </section>

        <section className="space-y-5">
          <SectionHeader
            eyebrow="Interest Rates & Yield Curve"
            title="US Treasury curve, key policy rates, and inversion watch"
            subtitle="The curve is interactive and the table keeps the live tenors pinned underneath."
            asOf={data?.rates.asOf ?? '—'}
            icon={<LineChartIcon className="w-4 h-4 text-purple-300" />}
          />
          <div className="grid gap-4 xl:grid-cols-[1.6fr_1fr]">
            <div className="glass rounded-3xl p-5 border border-white/10 bg-white/[0.03] backdrop-blur-2xl">
              <div className="flex items-center justify-between gap-3 flex-wrap mb-4">
                <div>
                  <div className="text-[10px] uppercase tracking-[0.35em] text-gray-500">Yield Curve</div>
                  <div className="text-lg font-medium text-white">Current Treasury curve</div>
                </div>
                <div className={data?.rates.spread.tone === 'negative' ? 'inline-flex items-center gap-2 rounded-full border border-rose-400/20 bg-rose-500/10 px-4 py-2 text-rose-200' : 'inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-4 py-2 text-emerald-200'}>
                  <span className="text-[10px] uppercase tracking-[0.3em]">Spread</span>
                  <span className="font-mono">{data?.rates.spread.value ?? '—'}</span>
                </div>
              </div>
              <YieldCurveChart data={data?.rates.curve ?? []} />
              <div className="mt-4 flex items-center justify-between gap-3 flex-wrap text-xs text-gray-400">
                <span>{data?.rates.inversionFlag ?? '—'}</span>
                <span className="font-mono">Updated {formatAsOf(data?.rates.asOf)}</span>
              </div>
            </div>

            <div className="glass rounded-3xl p-5 border border-white/10 bg-white/[0.03] backdrop-blur-2xl">
              <div className="flex items-center justify-between gap-3 flex-wrap mb-4">
                <div>
                  <div className="text-[10px] uppercase tracking-[0.35em] text-gray-500">Key Rates</div>
                  <div className="text-lg font-medium text-white">Live tenors and policy rate</div>
                </div>
              </div>
              <div className="space-y-2">
                {data?.rates.table.map((row) => (
                  <div key={row.tenor} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
                    <div>
                      <div className="text-sm text-gray-200">{row.tenor}</div>
                      <div className="text-[10px] uppercase tracking-[0.3em] text-gray-500">{row.asOf ? formatAsOf(row.asOf) : '—'}</div>
                    </div>
                    <div className="font-mono text-lg text-white">{row.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-5">
          <SectionHeader
            eyebrow="Equity Markets"
            title="Global indices with live prices, multi-period moves, and sparklines"
            subtitle="US and international benchmarks refresh against the same glassmorphism language used throughout the portal."
            asOf={data?.equities.asOf ?? '—'}
            icon={<Activity className="w-4 h-4 text-emerald-300" />}
          />
          {loadingMacro ? <LoadingSection count={8} /> : <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">{data?.equities.cards.map((card) => <MarketCard key={card.id} card={card} />)}</div>}
        </section>

        <section className="space-y-5">
          <SectionHeader
            eyebrow="Commodities & Metals"
            title="Energy, precious metals, and industrial metals"
            subtitle="A live cross-asset view that tracks the materials complex next to the equity tape."
            asOf={data?.commodities.asOf ?? '—'}
            icon={<Coins className="w-4 h-4 text-cyan-300" />}
          />
          {loadingMacro ? <LoadingSection count={7} /> : <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">{data?.commodities.cards.map((card) => <MarketCard key={card.id} card={card} />)}</div>}
        </section>

        <section className="space-y-5">
          <SectionHeader
            eyebrow="Labor / Inflation / Activity"
            title="Deep-dive panels for the macro tape"
            subtitle="Tabbed glass panels keep the lower-frequency context available without crowding the dashboard."
            asOf={data?.deepDive.asOf ?? '—'}
            icon={<BrainCircuit className="w-4 h-4 text-purple-300" />}
          />

          {loadingMacro ? (
            <LoadingSection count={4} />
          ) : (
            <div className="glass rounded-3xl p-5 border border-white/10 bg-white/[0.03] backdrop-blur-2xl">
              <Tabs defaultValue="labor" className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-white/5 border border-white/10">
                  <TabsTrigger value="labor" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-white">Labor</TabsTrigger>
                  <TabsTrigger value="inflation" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-white">Inflation</TabsTrigger>
                  <TabsTrigger value="activity" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-white">Activity</TabsTrigger>
                </TabsList>

                <TabsContent value="labor" className="mt-5">
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    {data?.deepDive.labor.map((card) => <MetricCard key={card.id} card={card} />)}
                  </div>
                </TabsContent>

                <TabsContent value="inflation" className="mt-5">
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {data?.deepDive.inflation.map((card) => <MetricCard key={card.id} card={card} />)}
                  </div>
                </TabsContent>

                <TabsContent value="activity" className="mt-5">
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    {data?.deepDive.activity.map((card) => <MetricCard key={card.id} card={card} />)}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </section>

        <section className="space-y-5">
          <SectionHeader
            eyebrow="Currency & Dollar"
            title="DXY and major pairs"
            subtitle="FX cards mirror the same live session behavior as the equity and commodity panels."
            asOf={data?.fx.asOf ?? '—'}
            icon={<Wind className="w-4 h-4 text-cyan-300" />}
          />
          {loadingMacro ? <LoadingSection count={7} /> : <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">{data?.fx.cards.map((card) => <MarketCard key={card.id} card={card} />)}</div>}
        </section>

        <footer className="glass rounded-3xl p-6 md:p-8 border border-white/10 bg-white/[0.03] backdrop-blur-2xl space-y-4">
          <div className="flex items-start justify-between gap-6 flex-wrap">
            <div>
              <div className="text-[10px] uppercase tracking-[0.35em] text-gray-500">Source attribution</div>
              <h3 className="mt-2 text-xl font-light text-white">Eco-Dash data sources</h3>
            </div>
            <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-gray-300">
              Generated {formatAsOf(data?.generatedAt ?? new Date().toISOString())}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <div className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-3">FRED</div>
              <ul className="space-y-1 text-sm text-gray-300">
                {data?.sources.fredSeries.map((series) => (
                  <li key={series.id}>
                    <span className="font-mono text-purple-300">{series.id}</span> — {series.title}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <div className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-3">Market endpoints</div>
              <ul className="space-y-1 text-sm text-gray-300">
                {data?.sources.marketSymbols.map((symbol) => (
                  <li key={symbol.symbol}>
                    <span className="font-mono text-cyan-300">{symbol.symbol}</span> — {symbol.label}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <div className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-3">Notes</div>
              <ul className="space-y-2 text-sm text-gray-300">
                {data?.sources.notes.map((note) => (
                  <li key={note} className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-purple-300 shrink-0" />
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
