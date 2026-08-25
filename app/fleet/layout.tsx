import { Metadata } from 'next';

const siteUrl = process.env.NEXTAUTH_URL || 'https://port0.me';

export const metadata: Metadata = {
  title: 'The Fleet',
  description: 'Rose oversees a small set of assistants around James Ortega.',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: `${siteUrl}/fleet`,
    siteName: 'Portal - James Ortega',
    title: 'The Fleet',
    description: 'Rose oversees a small set of assistants around James Ortega.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function FleetLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
