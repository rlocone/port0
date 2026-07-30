import type { MetricCardData, SparkPoint } from '@/lib/eco-types';

const FRED_BASE = 'https://api.stlouisfed.org/fred';
const FRED_API_KEY = process.env.FRED_API_KEY ?? '';

export interface FredSeriesGuideEntry {
  id: string;
  title: string;
  description: string;
}

export interface FredMetricConfig {
  id: string;
  seriesId: string;
  title: string;
  description: string;
  source: string;
  display: 'percent' | 'currency' | 'currencyCompact' | 'number' | 'compact';
  mode: 'level' | 'yoy';
  periodsPerYear?: number;
  sparklineLimit?: number;
  deltaLabel?: string;
}

export const FRED_SERIES_GUIDE: FredSeriesGuideEntry[] = [
  { id: 'GDPC1', title: 'Real Gross Domestic Product', description: 'Real GDP level used to compute GDP growth' },
  { id: 'CPIAUCSL', title: 'Consumer Price Index for All Urban Consumers', description: 'Headline CPI used to compute inflation YoY' },
  { id: 'UNRATE', title: 'Unemployment Rate', description: 'Monthly unemployment rate' },
  { id: 'FEDFUNDS', title: 'Effective Federal Funds Rate', description: 'Targeted short-term policy rate' },
  { id: 'DGS10', title: '10-Year Treasury Constant Maturity Rate', description: 'Benchmark 10Y Treasury yield' },
  { id: 'GFDEBTN', title: 'Federal Debt: Total Public Debt', description: 'Federal debt level used for debt snapshot' },
  { id: 'GFDEGDQ188S', title: 'Federal Debt: Total Public Debt as Percent of GDP', description: 'Debt-to-GDP ratio' },
  { id: 'POPTHM', title: 'U.S. Population', description: 'Monthly U.S. population in thousands' },
  { id: 'MTSDS133FMS', title: 'Federal Surplus or Deficit', description: 'Monthly Treasury surplus/deficit series used for deficit trend' },
  { id: 'DGS3MO', title: '3-Month Treasury Constant Maturity Rate', description: 'Front-end Treasury rate' },
  { id: 'DGS2', title: '2-Year Treasury Constant Maturity Rate', description: '2Y Treasury rate' },
  { id: 'DGS5', title: '5-Year Treasury Constant Maturity Rate', description: '5Y Treasury rate' },
  { id: 'DGS7', title: '7-Year Treasury Constant Maturity Rate', description: '7Y Treasury rate' },
  { id: 'DGS20', title: '20-Year Treasury Constant Maturity Rate', description: '20Y Treasury rate' },
  { id: 'DGS30', title: '30-Year Treasury Constant Maturity Rate', description: '30Y Treasury rate' },
  { id: 'PAYEMS', title: 'All Employees, Total Nonfarm', description: 'Total nonfarm payroll employment' },
  { id: 'ICSA', title: 'Initial Claims', description: 'Weekly initial unemployment claims' },
  { id: 'PCEPI', title: 'Personal Consumption Expenditures Price Index', description: 'Headline PCE price index' },
  { id: 'PCEPILFE', title: 'PCE excluding Food and Energy', description: 'Core PCE price index' },
  { id: 'INDPRO', title: 'Industrial Production Index', description: 'Industrial activity proxy' },
  { id: 'HOUST', title: 'Housing Starts', description: 'Monthly housing starts' },
  { id: 'UMCSENT', title: 'Consumer Sentiment', description: 'University of Michigan consumer sentiment' },
  { id: 'JTSJOL', title: 'Job Openings', description: 'JOLTS job openings' },
  { id: 'CIVPART', title: 'Labor Force Participation Rate', description: 'Civilian labor force participation' },
  { id: 'RETAILSMNSA', title: 'Retail Sales', description: 'Monthly retail sales, seasonally adjusted' },
];

function assertFredKey(): void {
  if (!FRED_API_KEY) {
    throw new Error('FRED_API_KEY is not set');
  }
}

function toNumber(value: string | number | null | undefined): number | null {
  if (value === null || value === undefined) return null;
  if (typeof value === 'number') return Number.isFinite(value) ? value : null;
  if (value === '.') return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function fmtNumber(value: number, digits = 1): string {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: digits,
    minimumFractionDigits: 0,
  }).format(value);
}

function fmtPercent(value: number, digits = 1): string {
  return `${value.toFixed(digits)}%`;
}

function fmtSignedPercent(value: number, digits = 1): string {
  const sign = value > 0 ? '+' : value < 0 ? '-' : '';
  return `${sign}${Math.abs(value).toFixed(digits)}%`;
}

function fmtCompact(value: number, digits = 1): string {
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: digits,
  }).format(value);
}

function fmtCurrency(value: number, compact = false, digits = 1): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: compact ? 'compact' : 'standard',
    maximumFractionDigits: digits,
  }).format(value);
}

function fmtSignedValue(value: number, display: FredMetricConfig['display']): string {
  const sign = value > 0 ? '+' : value < 0 ? '-' : '';
  const abs = Math.abs(value);

  switch (display) {
    case 'percent':
      return `${sign}${abs.toFixed(1)} pp`;
    case 'currency':
      return `${sign}${fmtCurrency(abs, false, 1)}`;
    case 'currencyCompact':
      return `${sign}${fmtCurrency(abs, true, 1)}`;
    case 'compact':
      return `${sign}${fmtCompact(abs, 1)}`;
    case 'number':
    default:
      return `${sign}${fmtNumber(abs, 1)}`;
  }
}

function fmtDisplay(value: number, display: FredMetricConfig['display']): string {
  switch (display) {
    case 'percent':
      return fmtPercent(value, 1);
    case 'currency':
      return fmtCurrency(value, false, 1);
    case 'currencyCompact':
      return fmtCurrency(value, true, 1);
    case 'compact':
      return fmtCompact(value, 1);
    case 'number':
    default:
      return fmtNumber(value, 1);
  }
}

export function toSparkline(points: SparkPoint[], limit = 60): SparkPoint[] {
  return points.filter((point) => point.value !== null).slice(-limit);
}

export function lastValue(points: SparkPoint[]): number | null {
  for (let i = points.length - 1; i >= 0; i -= 1) {
    const value = points[i]?.value ?? null;
    if (value !== null) return value;
  }
  return null;
}

export function nthFromEnd(points: SparkPoint[], n: number): number | null {
  if (n < 0) return null;
  let seen = 0;
  for (let i = points.length - 1; i >= 0; i -= 1) {
    const value = points[i]?.value ?? null;
    if (value === null) continue;
    if (seen === n) return value;
    seen += 1;
  }
  return null;
}

export function makeTrendTone(change: number | null): 'positive' | 'negative' | 'neutral' {
  if (change === null || !Number.isFinite(change) || Math.abs(change) < 0.0001) return 'neutral';
  return change > 0 ? 'positive' : 'negative';
}

export async function fetchFredObservations(seriesId: string, limit = 120): Promise<SparkPoint[]> {
  assertFredKey();

  const params = new URLSearchParams({
    series_id: seriesId,
    api_key: FRED_API_KEY,
    file_type: 'json',
    sort_order: 'desc',
    limit: String(limit),
  });

  const response = await fetch(`${FRED_BASE}/series/observations?${params.toString()}`, {
    cache: 'no-store',
    headers: { Accept: 'application/json' },
    signal: AbortSignal.timeout(12000),
  });

  if (!response.ok) {
    throw new Error(`FRED request failed for ${seriesId}: ${response.status}`);
  }

  const payload = (await response.json()) as {
    observations?: Array<{ date?: string; value?: string | number | null }>;
  };

  return (payload.observations ?? [])
    .map((observation) => ({
      date: observation.date ?? '',
      value: toNumber(observation.value),
    }))
    .filter((observation) => observation.date && observation.value !== null)
    .reverse();
}

export async function fetchFredMetric(config: FredMetricConfig): Promise<MetricCardData> {
  const points = await fetchFredObservations(config.seriesId, config.sparklineLimit ?? 120);
  const sparkline = toSparkline(points, config.sparklineLimit ?? 60);
  const latest = lastValue(points);
  const previous = nthFromEnd(points, 1);

  let displayValue = '—';
  let changeValue = undefined;
  let changeLabel = config.deltaLabel ?? 'vs prev period';
  let changeTone: 'positive' | 'negative' | 'neutral' = 'neutral';

  if (latest !== null) {
    if (config.mode === 'yoy') {
      const base = nthFromEnd(points, config.periodsPerYear ?? 4);
      if (base !== null && base !== 0) {
        const yoy = ((latest - base) / base) * 100;
        displayValue = `${fmtPercent(yoy, 1)} YoY`;

        const priorBase = nthFromEnd(points, (config.periodsPerYear ?? 4) + 1);
        const priorLatest = nthFromEnd(points, 1);
        if (priorBase !== null && priorBase !== 0 && priorLatest !== null) {
          const priorYoy = ((priorLatest - priorBase) / priorBase) * 100;
          const delta = yoy - priorYoy;
          changeValue = fmtSignedValue(delta, 'percent');
          changeTone = makeTrendTone(delta);
          changeLabel = 'vs prior period';
        }
      } else {
        displayValue = fmtDisplay(latest, config.display);
      }
    } else {
      displayValue = fmtDisplay(latest, config.display);
      if (previous !== null) {
        const delta = latest - previous;
        changeValue = fmtSignedValue(delta, config.display);
        changeTone = makeTrendTone(delta);
      }
    }
  }

  return {
    id: config.id,
    label: config.title,
    value: displayValue,
    numericValue: latest,
    asOf: points.at(-1)?.date ?? '',
    source: config.source,
    subtitle: config.description,
    changeLabel,
    changeValue,
    changeTone,
    sparkline,
  };
}

export function pickSeriesPointAtOrBefore(points: SparkPoint[], indexFromEnd: number): number | null {
  return nthFromEnd(points, indexFromEnd);
}

export function formatSeriesDate(date: string): string {
  if (!date) return '—';
  const parsed = new Date(date.includes('T') ? date : `${date}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime())) return date;
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(parsed);
}

export function formatSeriesDateTime(date: string): string {
  if (!date) return '—';
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short',
  }).format(parsed);
}

export function formatChangeForDisplay(value: number, display: FredMetricConfig['display']): string {
  return fmtSignedValue(value, display);
}

export function formatDisplayValue(value: number, display: FredMetricConfig['display']): string {
  return fmtDisplay(value, display);
}
