import type { MarketCardData, MarketCardData as MarketCard, SparkPoint, TrendBadge } from '@/lib/eco-types';

export interface MarketSymbolConfig {
  symbol: string;
  label: string;
  group: 'index' | 'commodity' | 'fx';
}

export const EQUITY_SYMBOLS: MarketSymbolConfig[] = [
  { symbol: '^GSPC', label: 'S&P 500', group: 'index' },
  { symbol: '^DJI', label: 'Dow Jones', group: 'index' },
  { symbol: '^IXIC', label: 'Nasdaq Composite', group: 'index' },
  { symbol: '^RUT', label: 'Russell 2000', group: 'index' },
  { symbol: '^FTSE', label: 'FTSE 100', group: 'index' },
  { symbol: '^GDAXI', label: 'DAX', group: 'index' },
  { symbol: '^N225', label: 'Nikkei 225', group: 'index' },
  { symbol: '^HSI', label: 'Hang Seng', group: 'index' },
];

export const COMMODITY_SYMBOLS: MarketSymbolConfig[] = [
  { symbol: 'CL=F', label: 'WTI Crude', group: 'commodity' },
  { symbol: 'BZ=F', label: 'Brent Crude', group: 'commodity' },
  { symbol: 'NG=F', label: 'Natural Gas', group: 'commodity' },
  { symbol: 'GC=F', label: 'Gold', group: 'commodity' },
  { symbol: 'SI=F', label: 'Silver', group: 'commodity' },
  { symbol: 'PL=F', label: 'Platinum', group: 'commodity' },
  { symbol: 'PA=F', label: 'Palladium', group: 'commodity' },
];

export const FX_SYMBOLS: MarketSymbolConfig[] = [
  { symbol: 'DX-Y.NYB', label: 'U.S. Dollar Index', group: 'fx' },
  { symbol: 'EURUSD=X', label: 'EUR / USD', group: 'fx' },
  { symbol: 'GBPUSD=X', label: 'GBP / USD', group: 'fx' },
  { symbol: 'USDJPY=X', label: 'USD / JPY', group: 'fx' },
  { symbol: 'AUDUSD=X', label: 'AUD / USD', group: 'fx' },
  { symbol: 'USDCAD=X', label: 'USD / CAD', group: 'fx' },
  { symbol: 'USDCHF=X', label: 'USD / CHF', group: 'fx' },
];

function toNumber(value: unknown): number | null {
  const parsed = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function compactDate(date: string): number {
  return new Date(date).getTime();
}

function nearestValue(points: SparkPoint[], targetMillis: number): number | null {
  let candidate: number | null = null;
  for (const point of points) {
    const millis = compactDate(point.date);
    if (Number.isNaN(millis)) continue;
    if (millis <= targetMillis && point.value !== null) {
      candidate = point.value;
    }
    if (millis > targetMillis) break;
  }
  return candidate;
}

function formatPrice(value: number, group: MarketSymbolConfig['group']): string {
  if (group === 'commodity') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  }

  if (group === 'fx') {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 4,
      maximumFractionDigits: 4,
    }).format(value);
  }

  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function formatPercentChange(value: number | null): string {
  if (value === null || !Number.isFinite(value)) return '—';
  const sign = value > 0 ? '+' : value < 0 ? '-' : '';
  return `${sign}${Math.abs(value).toFixed(2)}%`;
}

function toneForChange(value: number | null): TrendBadge['tone'] {
  if (value === null || !Number.isFinite(value) || Math.abs(value) < 0.0001) return 'neutral';
  return value > 0 ? 'positive' : 'negative';
}

function summarizeChange(label: string, value: number | null): TrendBadge {
  return {
    label,
    value: formatPercentChange(value),
    tone: toneForChange(value),
  };
}

function inferMarketSession(meta: Record<string, unknown>, nowSeconds = Math.floor(Date.now() / 1000)): string {
  const current = meta.currentTradingPeriod as Record<string, Record<string, number | string> | undefined> | undefined;
  const regular = current?.regular;
  const pre = current?.pre;
  const post = current?.post;

  const regularStart = toNumber(regular?.start);
  const regularEnd = toNumber(regular?.end);
  const preStart = toNumber(pre?.start);
  const preEnd = toNumber(pre?.end);
  const postStart = toNumber(post?.start);
  const postEnd = toNumber(post?.end);

  if (regularStart !== null && regularEnd !== null && nowSeconds >= regularStart && nowSeconds <= regularEnd) {
    return 'OPEN';
  }

  if (preStart !== null && preEnd !== null && nowSeconds >= preStart && nowSeconds <= preEnd) {
    return 'PRE-MARKET';
  }

  if (postStart !== null && postEnd !== null && nowSeconds >= postStart && nowSeconds <= postEnd) {
    return 'AFTER-HOURS';
  }

  return 'CLOSED';
}

async function fetchChart(symbol: string): Promise<{
  price: number | null;
  marketState: string;
  asOf: string;
  history: SparkPoint[];
  changePills: TrendBadge[];
}> {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?range=1y&interval=1d&includePrePost=false&events=div,splits`;
  const response = await fetch(url, {
    cache: 'no-store',
    headers: {
      'User-Agent': 'Mozilla/5.0',
      Accept: 'application/json',
    },
    signal: AbortSignal.timeout(12000),
  });

  if (!response.ok) {
    throw new Error(`Yahoo Finance request failed for ${symbol}: ${response.status}`);
  }

  const payload = await response.json() as {
    chart?: {
      result?: Array<{
        meta?: Record<string, unknown> & {
          regularMarketPrice?: number;
          regularMarketTime?: number;
        };
        timestamp?: number[];
        indicators?: {
          quote?: Array<{ close?: Array<number | null> }>;
        };
      }>;
    };
  };

  const result = payload.chart?.result?.[0];
  if (!result) {
    throw new Error(`Missing chart data for ${symbol}`);
  }

  const meta = result.meta ?? {};
  const timestamps = result.timestamp ?? [];
  const closes = result.indicators?.quote?.[0]?.close ?? [];
  const history = timestamps
    .map((timestamp, index) => ({
      date: new Date(timestamp * 1000).toISOString(),
      value: toNumber(closes[index]),
    }))
    .filter((point) => point.value !== null);

  const price = toNumber(meta.regularMarketPrice) ?? history.at(-1)?.value ?? null;
  const now = Math.floor(Date.now() / 1000);
  const marketState = inferMarketSession(meta, now);
  const asOf = meta.regularMarketTime
    ? new Date(meta.regularMarketTime * 1000).toISOString()
    : history.at(-1)?.date ?? new Date().toISOString();

  const latest = history.at(-1)?.value ?? price;
  const changes = [
    { label: '1D', value: nearestValue(history, Date.now() - 24 * 60 * 60 * 1000) },
    { label: '5D', value: nearestValue(history, Date.now() - 5 * 24 * 60 * 60 * 1000) },
    { label: '1M', value: nearestValue(history, Date.now() - 30 * 24 * 60 * 60 * 1000) },
    { label: '1Y', value: nearestValue(history, Date.now() - 365 * 24 * 60 * 60 * 1000) },
  ].map((entry) => {
    if (latest === null || entry.value === null || entry.value === 0) {
      return summarizeChange(entry.label, null);
    }
    const pct = ((latest / entry.value) - 1) * 100;
    return summarizeChange(entry.label, pct);
  });

  return {
    price,
    marketState,
    asOf,
    history,
    changePills: changes,
  };
}

export function formatMarketPrice(value: number, group: MarketSymbolConfig['group']): string {
  return formatPrice(value, group);
}

export function getHistoryWindow(points: SparkPoint[], size = 60): SparkPoint[] {
  return points.filter((point) => point.value !== null).slice(-size);
}

export async function fetchMarketCard(config: MarketSymbolConfig): Promise<MarketCard> {
  const chart = await fetchChart(config.symbol);
  return {
    id: config.symbol,
    label: config.label,
    symbol: config.symbol,
    price: chart.price === null ? '—' : formatPrice(chart.price, config.group),
    asOf: chart.asOf,
    source: 'Yahoo Finance chart',
    marketState: chart.marketState,
    changePills: chart.changePills,
    sparkline: getHistoryWindow(chart.history, 60),
  };
}

export async function fetchMarketCards(configs: MarketSymbolConfig[]): Promise<MarketCard[]> {
  const results: MarketCard[] = [];
  const batchSize = 4;

  for (let i = 0; i < configs.length; i += batchSize) {
    const batch = configs.slice(i, i + batchSize);
    const settled = await Promise.allSettled(batch.map((config) => fetchMarketCard(config)));
    for (const entry of settled) {
      if (entry.status === 'fulfilled') {
        results.push(entry.value);
      }
    }
  }

  return results;
}
