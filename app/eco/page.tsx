import type { Metadata } from 'next';
import EcoDash from '@/components/eco/eco-dash';

export const metadata: Metadata = {
  title: 'Eco-Dash',
  description: 'Real-time economic indicators dashboard with live macro, rates, markets, commodities, and FX data.',
};

export default function EcoPage() {
  return <EcoDash />;
}
