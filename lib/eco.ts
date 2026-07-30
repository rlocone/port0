import type { EcoDashboardData, MetricCardData, YieldCurvePoint, SparkPoint } from '@/lib/eco-types';
import {
  fetchFredMetric,
  fetchFredObservations,
  FRED_SERIES_GUIDE,
  type FredMetricConfig,
  formatDisplayValue,
  formatChangeForDisplay,
  lastValue,
  nthFromEnd,
  toSparkline,
} from '@/lib/fred';
import {
  COMMODITY_SYMBOLS,
  EQUITY_SYMBOLS,
  FX_SYMBOLS,
  fetchMarketCards,
} from '@/lib/market';

const macroConfigs: FredMetricConfig[] = [
  {
    id: 'gdp_growth',
    seriesId: 'GDPC1',
    title: 'Real GDP Growth',
    description: 'Real GDP year-over-year growth',
    source: 'FRED / BEA',
    display: 'percent',
    mode: 'yoy',
    periodsPerYear: 4,
    deltaLabel: 'vs prior quarter',
    sparklineLimit: 40,
  },
  {
    id: 'cpi_yoy',
    seriesId: 'CPIAUCSL',
    title: 'CPI YoY',
    description: 'Consumer price index year-over-year change',
    source: 'FRED / BLS',
    display: 'percent',
    mode: 'yoy',
    periodsPerYear: 12,
    deltaLabel: 'vs prior month',
    sparklineLimit: 36,
  },
  {
    id: 'unemployment',
    seriesId: 'UNRATE',
    title: 'Unemployment Rate',
    description: 'Civilian unemployment rate',
    source: 'FRED / BLS',
    display: 'percent',
    mode: 'level',
    deltaLabel: 'vs prior month',
    sparklineLimit: 36,
  },
  {
    id: 'fed_funds',
    seriesId: 'FEDFUNDS',
    title: 'Fed Funds',
    description: 'Effective federal funds rate',
    source: 'FRED / Federal Reserve',
    display: 'percent',
    mode: 'level',
    deltaLabel: 'vs prior month',
    sparklineLimit: 36,
  },
  {
    id: 'ten_year',
    seriesId: 'DGS10',
    title: '10Y Treasury',
    description: '10-year Treasury constant maturity rate',
    source: 'FRED / Treasury',
    display: 'percent',
    mode: 'level',
    deltaLabel: 'vs prior session',
    sparklineLimit: 180,
  },
];

const debtConfigs: FredMetricConfig[] = [
  {
    id: 'total_debt',
    seriesId: 'GFDEBTN',
    title: 'Total Debt',
    description: 'Federal debt outstanding',
    source: 'FRED / Treasury',
    display: 'currencyCompact',
    mode: 'level',
    deltaLabel: 'vs prior month',
    sparklineLimit: 40,
  },
  {
    id: 'debt_to_gdp',
    seriesId: 'GFDEGDQ188S',
    title: 'Debt / GDP',
    description: 'Federal debt as share of GDP',
    source: 'FRED / Treasury',
    display: 'percent',
    mode: 'level',
    deltaLabel: 'vs prior quarter',
    sparklineLimit: 40,
  },
  {
    id: 'deficit_trend',
    seriesId: 'MTSDS133FMS',
    title: 'Monthly Deficit',
    description: 'Federal surplus / deficit trend',
    source: 'FRED / Treasury',
    display: 'currencyCompact',
    mode: 'level',
    deltaLabel: 'vs prior month',
    sparklineLimit: 60,
  },
];

const laborConfigs: FredMetricConfig[] = [
  {
    id: 'payrolls',
    seriesId: 'PAYEMS',
    title: 'Payrolls',
    description: 'Total nonfarm employment',
    source: 'FRED / BLS',
    display: 'compact',
    mode: 'level',
    deltaLabel: 'vs prior month',
    sparklineLimit: 36,
  },
  {
    id: 'claims',
    seriesId: 'ICSA',
    title: 'Initial Claims',
    description: 'Weekly initial unemployment claims',
    source: 'FRED / DOL',
    display: 'compact',
    mode: 'level',
    deltaLabel: 'vs prior week',
    sparklineLimit: 60,
  },
  {
    id: 'participation',
    seriesId: 'CIVPART',
    title: 'Participation',
    description: 'Civilian labor force participation rate',
    source: 'FRED / BLS',
    display: 'percent',
    mode: 'level',
    deltaLabel: 'vs prior month',
    sparklineLimit: 36,
  },
  {
    id: 'job_openings',
    seriesId: 'JTSJOL',
    title: 'Job Openings',
    description: 'JOLTS job openings',
    source: 'FRED / BLS',
    display: 'compact',
    mode: 'level',
    deltaLabel: 'vs prior month',
    sparklineLimit: 36,
  },
];

const inflationConfigs: FredMetricConfig[] = [
  {
    id: 'headline_cpi',
    seriesId: 'CPIAUCSL',
    title: 'Headline CPI',
    description: 'Consumer price index level',
    source: 'FRED / BLS',
    display: 'number',
    mode: 'level',
    deltaLabel: 'vs prior month',
    sparklineLimit: 36,
  },
  {
    id: 'core_pce',
    seriesId: 'PCEPILFE',
    title: 'Core PCE',
    description: 'PCE excluding food and energy',
    source: 'FRED / BEA',
    display: 'number',
    mode: 'level',
    deltaLabel: 'vs prior month',
    sparklineLimit: 36,
  },
  {
    id: 'pcepi',
    seriesId: 'PCEPI',
    title: 'PCE Price Index',
    description: 'Headline PCE price index',
    source: 'FRED / BEA',
    display: 'number',
    mode: 'level',
    deltaLabel: 'vs prior month',
    sparklineLimit: 36,
  },
];

const activityConfigs: FredMetricConfig[] = [
  {
    id: 'industrial_production',
    seriesId: 'INDPRO',
    title: 'Industrial Production',
    description: 'Industrial production index',
    source: 'FRED / Fed',
    display: 'number',
    mode: 'level',
    deltaLabel: 'vs prior month',
    sparklineLimit: 36,
  },
  {
    id: 'housing_starts',
    seriesId: 'HOUST',
    title: 'Housing Starts',
    description: 'Monthly housing starts',
    source: 'FRED / Census',
    display: 'compact',
    mode: 'level',
    deltaLabel: 'vs prior month',
    sparklineLimit: 36,
  },
  {
    id: 'retail_sales',
    seriesId: 'RETAILSMNSA',
    title: 'Retail Sales',
    description: 'Retail sales, seasonally adjusted',
    source: 'FRED / Census',
    display: 'compact',
    mode: 'level',
    deltaLabel: 'vs prior month',
    sparklineLimit: 36,
  },
  {
    id: 'consumer_sentiment',
    seriesId: 'UMCSENT',
    title: 'Consumer Sentiment',
    description: 'University of Michigan consumer sentiment',
    source: 'FRED / UMich',
    display: 'number',
    mode: 'level',
    deltaLabel: 'vs prior month',
    sparklineLimit: 36,
  },
];

const rateConfigs: FredMetricConfig[] = [
  { id: 'dgs3mo', seriesId: 'DGS3MO', title: '3M', description: '3-month Treasury rate', source: 'FRED / Treasury', display: 'percent', mode: 'level', deltaLabel: 'vs prior session', sparklineLimit: 180 },
  { id: 'dgs2', seriesId: 'DGS2', title: '2Y', description: '2-year Treasury rate', source: 'FRED / Treasury', display: 'percent', mode: 'level', deltaLabel: 'vs prior session', sparklineLimit: 180 },
  { id: 'dgs5', seriesId: 'DGS5', title: '5Y', description: '5-year Treasury rate', source: 'FRED / Treasury', display: 'percent', mode: 'level', deltaLabel: 'vs prior session', sparklineLimit: 180 },
  { id: 'dgs7', seriesId: 'DGS7', title: '7Y', description: '7-year Treasury rate', source: 'FRED / Treasury', display: 'percent', mode: 'level', deltaLabel: 'vs prior session', sparklineLimit: 180 },
  { id: 'dgs10', seriesId: 'DGS10', title: '10Y', description: '10-year Treasury rate', source: 'FRED / Treasury', display: 'percent', mode: 'level', deltaLabel: 'vs prior session', sparklineLimit: 180 },
  { id: 'dgs20', seriesId: 'DGS20', title: '20Y', description: '20-year Treasury rate', source: 'FRED / Treasury', display: 'percent', mode: 'level', deltaLabel: 'vs prior session', sparklineLimit: 180 },
  { id: 'dgs30', seriesId: 'DGS30', title: '30Y', description: '30-year Treasury rate', source: 'FRED / Treasury', display: 'percent', mode: 'level', deltaLabel: 'vs prior session', sparklineLimit: 180 },
  { id: 'fedfunds', seriesId: 'FEDFUNDS', title: 'Fed Funds', description: 'Effective fed funds rate', source: 'FRED / Fed', display: 'percent', mode: 'level', deltaLabel: 'vs prior month', sparklineLimit: 36 },
];

function maxDate(values: Array<string | undefined>): string {
  const filtered = values.filter(Boolean) as string[];
  if (filtered.length === 0) return '';
  return filtered.sort((a, b) => new Date(a).getTime() - new Date(b).getTime()).at(-1) ?? '';
}

function formatMillionPopulation(valueThousands: number): string {
  return `${(valueThousands / 1000).toFixed(1)}M`;
}

function buildManualMetric(params: {
  id: string;
  label: string;
  value: string;
  numericValue: number | null;
  asOf: string;
  source: string;
  subtitle: string;
  changeLabel: string;
  changeValue?: string;
  changeTone?: 'positive' | 'negative' | 'neutral';
  sparkline: SparkPoint[];
}): MetricCardData {
  return {
    id: params.id,
    label: params.label,
    value: params.value,
    numericValue: params.numericValue,
    asOf: params.asOf,
    source: params.source,
    subtitle: params.subtitle,
    changeLabel: params.changeLabel,
    changeValue: params.changeValue,
    changeTone: params.changeTone ?? 'neutral',
    sparkline: params.sparkline,
  };
}

async function collectFredMetrics(configs: FredMetricConfig[]): Promise<{
  cards: MetricCardData[];
  errors: string[];
}> {
  const settled = await Promise.allSettled(configs.map((config) => fetchFredMetric(config)));
  const cards: MetricCardData[] = [];
  const errors: string[] = [];

  settled.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      cards.push(result.value);
    } else {
      errors.push(`${configs[index]?.seriesId ?? 'FRED'}: ${result.reason instanceof Error ? result.reason.message : 'failed to load'}`);
    }
  });

  return { cards, errors };
}

async function buildPopulationMetric(): Promise<{ card: MetricCardData; errors: string[] }> {
  try {
    const points = await fetchFredObservations('POPTHM', 36);
    const sparkline = toSparkline(points, 24);
    const latest = lastValue(points);
    const previous = nthFromEnd(points, 1);
    const value = latest === null ? '—' : formatMillionPopulation(latest);
    const changeValue = latest === null || previous === null
      ? undefined
      : `${latest > previous ? '+' : latest < previous ? '-' : ''}${Math.abs(latest - previous).toFixed(0)}K`;

    return {
      card: buildManualMetric({
        id: 'population',
        label: 'U.S. Population',
        value,
        numericValue: latest,
        asOf: points.at(-1)?.date ?? '',
        source: 'FRED / Census',
        subtitle: 'Population in millions',
        changeLabel: 'vs prior month',
        changeValue,
        changeTone: latest === null || previous === null ? 'neutral' : latest > previous ? 'positive' : latest < previous ? 'negative' : 'neutral',
        sparkline,
      }),
      errors: [],
    };
  } catch (error) {
    return {
      card: buildManualMetric({
        id: 'population',
        label: 'U.S. Population',
        value: '—',
        numericValue: null,
        asOf: '',
        source: 'FRED / Census',
        subtitle: 'Population in millions',
        changeLabel: 'vs prior month',
        sparkline: [],
      }),
      errors: [error instanceof Error ? error.message : 'Failed to load population series'],
    };
  }
}

async function buildDebtPerCapitaMetric(totalDebt: MetricCardData | undefined, population: MetricCardData | undefined): Promise<{ card: MetricCardData; errors: string[] }> {
  if (!totalDebt?.numericValue || !population?.numericValue) {
    return {
      card: buildManualMetric({
        id: 'debt_per_capita',
        label: 'Debt / Capita',
        value: '—',
        numericValue: null,
        asOf: maxDate([totalDebt?.asOf, population?.asOf]),
        source: 'Derived from FRED series',
        subtitle: 'Debt per U.S. resident',
        changeLabel: 'derived',
        sparkline: [],
      }),
      errors: [],
    };
  }

  const perCapita = totalDebt.numericValue / (population.numericValue * 1000);
  return {
    card: buildManualMetric({
      id: 'debt_per_capita',
      label: 'Debt / Capita',
      value: new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        notation: 'compact',
        maximumFractionDigits: 1,
      }).format(perCapita),
      numericValue: perCapita,
      asOf: maxDate([totalDebt.asOf, population.asOf]),
      source: 'Derived from FRED series',
      subtitle: 'Debt per U.S. resident',
      changeLabel: 'derived',
      changeValue: `${new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        notation: 'compact',
        maximumFractionDigits: 1,
      }).format(perCapita)}`,
      changeTone: 'neutral',
      sparkline: totalDebt.sparkline,
    }),
    errors: [],
  };
}

function buildYieldCurve(cards: MetricCardData[]): {
  curve: YieldCurvePoint[];
  table: Array<{ tenor: string; value: string; asOf: string }>;
  spread: { label: string; value: string; tone: 'positive' | 'negative' | 'neutral' };
  inversionFlag: string;
  asOf: string;
} {
  const order = ['3M', '2Y', '5Y', '7Y', '10Y', '20Y', '30Y'];
  const byLabel = new Map(cards.map((card) => [card.label, card]));
  const curve = order.map((tenor) => {
    const card = byLabel.get(tenor);
    return {
      tenor,
      label: card?.label ?? tenor,
      value: card?.value ?? '—',
      numericValue: card?.numericValue ?? null,
      asOf: card?.asOf ?? '',
    };
  });

  const table = curve.map((point) => ({
    tenor: point.tenor,
    value: point.value,
    asOf: point.asOf,
  }));

  const threeMonth = byLabel.get('3M')?.numericValue ?? null;
  const tenYear = byLabel.get('10Y')?.numericValue ?? null;
  const twoYear = byLabel.get('2Y')?.numericValue ?? null;

  let spreadValue = null;
  let spreadLabel = '10Y - 3M';
  if (threeMonth !== null && tenYear !== null) {
    spreadValue = tenYear - threeMonth;
  }
  const tone: 'positive' | 'negative' | 'neutral' = spreadValue === null ? 'neutral' : spreadValue >= 0 ? 'positive' : 'negative';
  const inversionFlag = spreadValue !== null && spreadValue < 0
    ? 'Inversion detected: 3M yield above 10Y'
    : 'Curve normal: 10Y yield above 3M';

  const spread = {
    label: spreadLabel,
    value: spreadValue === null ? '—' : formatChangeForDisplay(spreadValue, 'percent'),
    tone,
  };

  return {
    curve,
    table,
    spread,
    inversionFlag: twoYear !== null && tenYear !== null && twoYear > tenYear
      ? '2Y/10Y inversion remains in force'
      : inversionFlag,
    asOf: maxDate(cards.map((card) => card.asOf)),
  };
}

function buildSources(): EcoDashboardData['sources'] {
  return {
    fredSeries: FRED_SERIES_GUIDE,
    marketSymbols: [
      ...EQUITY_SYMBOLS,
      ...COMMODITY_SYMBOLS,
      ...FX_SYMBOLS,
    ].map((entry) => ({
      symbol: entry.symbol,
      label: entry.label,
      group: entry.group,
    })),
    notes: [
      'Market data via Yahoo Finance chart endpoint (unofficial, live session values).',
      'Macro, labor, inflation, and rates via the official FRED API.',
      'Debt / deficit data sourced from FRED Treasury series, with derived per-capita calculations.',
    ],
  };
}

export async function buildEcoDashboardData(): Promise<EcoDashboardData> {
  const errors: string[] = [];

  const [macro, debt, labor, inflation, activity, rateCards, equities, commodities, fx] = await Promise.all([
    collectFredMetrics(macroConfigs),
    collectFredMetrics(debtConfigs),
    collectFredMetrics(laborConfigs),
    collectFredMetrics(inflationConfigs),
    collectFredMetrics(activityConfigs),
    collectFredMetrics(rateConfigs),
    fetchMarketCards(EQUITY_SYMBOLS),
    fetchMarketCards(COMMODITY_SYMBOLS),
    fetchMarketCards(FX_SYMBOLS),
  ]);

  errors.push(...macro.errors, ...debt.errors, ...labor.errors, ...inflation.errors, ...activity.errors, ...rateCards.errors);

  const population = await buildPopulationMetric();
  errors.push(...population.errors);

  const debtPerCapita = await buildDebtPerCapitaMetric(
    debt.cards.find((card) => card.id === 'total_debt'),
    population.card
  );
  errors.push(...debtPerCapita.errors);

  const yieldCurve = buildYieldCurve(rateCards.cards);

  const marketStatusCard = equities[0] ?? commodities[0] ?? fx[0] ?? null;
  const marketOpen = marketStatusCard?.marketState === 'OPEN';
  const marketLabel = marketStatusCard?.marketState
    ? marketStatusCard.marketState
    : marketOpen ? 'OPEN' : 'CLOSED';

  const debtCards = [
    ...debt.cards.filter((card) => card.id !== 'deficit_trend'),
    population.card,
    debtPerCapita.card,
    debt.cards.find((card) => card.id === 'deficit_trend') ?? buildManualMetric({
      id: 'deficit_trend',
      label: 'Monthly Deficit',
      value: '—',
      numericValue: null,
      asOf: '',
      source: 'FRED / Treasury',
      subtitle: 'Federal surplus / deficit trend',
      changeLabel: 'vs prior month',
      sparkline: [],
    }),
  ];

  return {
    generatedAt: new Date().toISOString(),
    marketStatus: {
      label: marketLabel,
      isOpen: marketOpen,
      asOf: marketStatusCard?.asOf ?? new Date().toISOString(),
    },
    macro: {
      asOf: maxDate(macro.cards.map((card) => card.asOf)),
      cards: macro.cards,
    },
    debt: {
      asOf: maxDate(debtCards.map((card) => card.asOf)),
      cards: debtCards,
      deficitTrend: debt.cards.find((card) => card.id === 'deficit_trend') ?? debtCards[debtCards.length - 1],
    },
    rates: {
      asOf: yieldCurve.asOf,
      curve: yieldCurve.curve,
      spread: yieldCurve.spread,
      inversionFlag: yieldCurve.inversionFlag,
      table: yieldCurve.table,
    },
    equities: {
      asOf: maxDate(equities.map((card) => card.asOf)),
      cards: equities,
    },
    commodities: {
      asOf: maxDate(commodities.map((card) => card.asOf)),
      cards: commodities,
    },
    fx: {
      asOf: maxDate(fx.map((card) => card.asOf)),
      cards: fx,
    },
    deepDive: {
      asOf: maxDate([
        ...labor.cards.map((card) => card.asOf),
        ...inflation.cards.map((card) => card.asOf),
        ...activity.cards.map((card) => card.asOf),
      ]),
      labor: labor.cards,
      inflation: inflation.cards,
      activity: activity.cards,
    },
    sources: buildSources(),
    errors,
  };
}
