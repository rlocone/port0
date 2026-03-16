import type { Metadata } from 'next';
import './globals.css';

export const dynamic = 'force-dynamic';

const siteUrl = process.env.NEXTAUTH_URL || 'https://port0.abacusai.app';
const siteName = 'Portal';
const siteDescription = 'A personal dashboard with ethereal glassmorphism design featuring real-time clocks, weather, and curated content.';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteName,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: siteName,
    title: siteName,
    description: siteDescription,
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Portal - Personal Dashboard',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteName,
    description: siteDescription,
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
  other: {
    'og:image:secure_url': `${siteUrl}/og-image.png`,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script src="https://apps.abacus.ai/chatllm/appllm-lib.js"></script>
      </head>
      <body className="antialiased min-h-screen">
        {/* Background orbs */}
        <div className="orb orb-purple w-96 h-96 top-10 left-10 animate-pulse-glow" />
        <div className="orb orb-cyan w-80 h-80 bottom-20 right-20 animate-pulse-glow" style={{ animationDelay: '1.5s' }} />
        <div className="orb orb-purple w-64 h-64 top-1/2 right-1/4 animate-pulse-glow" style={{ animationDelay: '3s' }} />
        {children}
      </body>
    </html>
  );
}
