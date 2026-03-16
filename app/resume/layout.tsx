import { Metadata } from 'next';

const siteUrl = process.env.NEXTAUTH_URL || 'https://port0.abacusai.app';

export const metadata: Metadata = {
  title: 'Resume & CV | James Ortega - IT Support Specialist & AI Systems Engineer',
  description: 'Interactive resume of James Ortega showcasing expertise in AI Systems Engineering, Agentic Workflows, IT Support, Linux Administration, and Network Security. Specializing in Constructive AI and enterprise technology solutions.',
  keywords: ['James Ortega', 'Resume', 'CV', 'IT Support', 'AI Systems Engineer', 'Agentic Workflows', 'Linux', 'Network Security', 'Tallahassee'],
  authors: [{ name: 'James Ortega' }],
  openGraph: {
    type: 'profile',
    locale: 'en_US',
    url: `${siteUrl}/resume`,
    siteName: 'Portal - James Ortega',
    title: 'James Ortega | IT Support Specialist & AI Systems Engineer',
    description: 'Interactive resume showcasing expertise in AI Systems Engineering, Agentic Workflows, IT Support, Linux Administration, and Network Security.',
    images: [
      {
        url: `${siteUrl}/og-resume.png`,
        width: 1200,
        height: 630,
        alt: 'James Ortega - Resume & CV',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'James Ortega | IT Support Specialist & AI Systems Engineer',
    description: 'Interactive resume: AI Systems Engineering, Agentic Workflows, IT Support & Network Security expertise.',
    images: [`${siteUrl}/og-resume.png`],
  },
  robots: {
    index: true,
    follow: true,
  },
  other: {
    'og:image:secure_url': `${siteUrl}/og-resume.png`,
  },
};

export default function ResumeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
