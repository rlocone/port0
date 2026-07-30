export interface SparkPoint {
  date: string;
  value: number | null;
}

export type TrendTone = 'positive' | 'negative' | 'neutral';

export interface TrendBadge {
  label: string;
  value: string;
  tone: TrendTone;
}

export interface MetricCardData {
  id: string;
  label: string;
  value: string;
  numericValue: number | null;
  asOf: string;
  source: string;
  subtitle?: string;
  changeLabel?: string;
  changeValue?: string;
  changeTone?: TrendTone;
  sparkline: SparkPoint[];
}

export interface MarketCardData {
  id: string;
  label: string;
  symbol: string;
  price: string;
  asOf: string;
  source: string;
  marketState: string;
  changePills: TrendBadge[];
  sparkline: SparkPoint[];
}

export interface YieldCurvePoint {
  tenor: string;
  label: string;
  value: string;
  numericValue: number | null;
  asOf: string;
}

export interface EcoSectionSnapshot {
  asOf: string;
}

export interface EcoDashboardData {
  generatedAt: string;
  marketStatus: {
    label: string;
    isOpen: boolean;
    asOf: string;
  };
  macro: EcoSectionSnapshot & {
    cards: MetricCardData[];
  };
  debt: EcoSectionSnapshot & {
    cards: MetricCardData[];
    deficitTrend: MetricCardData;
  };
  rates: EcoSectionSnapshot & {
    curve: YieldCurvePoint[];
    spread: {
      label: string;
      value: string;
      tone: TrendTone;
    };
    inversionFlag: string;
    table: Array<{
      tenor: string;
      value: string;
      asOf: string;
    }>;
  };
  equities: EcoSectionSnapshot & {
    cards: MarketCardData[];
  };
  commodities: EcoSectionSnapshot & {
    cards: MarketCardData[];
  };
  fx: EcoSectionSnapshot & {
    cards: MarketCardData[];
  };
  deepDive: EcoSectionSnapshot & {
    labor: MetricCardData[];
    inflation: MetricCardData[];
    activity: MetricCardData[];
  };
  sources: {
    fredSeries: Array<{
      id: string;
      title: string;
      description: string;
    }>;
    marketSymbols: Array<{
      symbol: string;
      label: string;
      group: string;
    }>;
    notes: string[];
  };
  errors: string[];
}
