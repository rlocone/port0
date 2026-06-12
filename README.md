# Portal (port0.me)

A personal dashboard with ethereal glassmorphism design featuring real-time clocks, weather, curated RSS feeds, and an interactive resume.

Built with [Next.js](https://nextjs.org/) (App Router), [React](https://react.dev/), [Tailwind CSS](https://tailwindcss.com/), and [Lucide icons](https://lucide.dev/).

## Features

- **Digital clock** — Real-time browser time, UTC time, Unix timestamp, week number, day of year, quarter
- **Weather** — Live Tallahassee, FL weather via [Open-Meteo](https://open-meteo.com/) (free, no API key required)
- **RSS feeds** — Curated feeds from Imzadi and PhiPi, fetched server-side via a proxy with SSRF protection
- **Rose Reports** — Latest research reports from the Mission Control agent dashboard
- **GitHub commits** — Recent commits from the Mission Control repository
- **Social links** — Configurable link buttons (Facebook, GitHub, Imzadi, PhiPi, Rose, etc.)
- **Interactive resume** — Full interactive CV with skills, experience, certifications, and downloadable PDF

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + custom CSS animations |
| Icons | Lucide React |
| Data fetching | Server-side API routes + client components |
| Weather | Open-Meteo (free, no API key) |
| RSS | Custom proxy with domain allowlist |
| PDF | Static file (`CV_Revised.pdf`) |

## Getting Started

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Start development server
npm run dev
```

The site will be available at `http://localhost:3000`.

### Environment Variables

| Variable | Required | Description |
|---|---|---|
| `NEXTAUTH_URL` | Yes | Canonical site URL (e.g. `https://port0.me`) |
| `NEXT_PUBLIC_ADMIN_PASSWORD` | No | Admin panel password (panel was removed; kept for future use) |

## Project Structure

```
.
├── app/
│   ├── api/
│   │   ├── generate-cv-pdf/   # Serves static CV PDF
│   │   ├── rss/                # RSS/Atom/JSON feed proxy with domain allowlist
│   │   └── weather/            # Open-Meteo weather API proxy
│   ├── resume/                 # Interactive resume page
│   ├── globals.css             # Global styles, glassmorphism, animations
│   ├── layout.tsx              # Root layout with OG metadata
│   └── page.tsx                # Home page (dashboard)
├── components/
│   ├── commits-feed.tsx        # GitHub commits feed widget
│   ├── digital-clock.tsx       # Clock + time info widget
│   ├── reports-feed.tsx        # Rose reports feed widget
│   ├── rss-card.tsx            # Reusable RSS feed card
│   ├── social-links.tsx        # Social/media link buttons
│   └── weather-card.tsx        # Weather display widget
├── public/
│   ├── CV_Revised.pdf          # Static CV PDF for download
│   ├── favicon.svg
│   ├── og-image.webp           # Open Graph image (13 KB)
│   └── og-resume.webp          # Resume OG image (40 KB)
└── next.config.js              # Next.js configuration
```

## History

This site was originally hosted on Abacus AI's platform (`port0.abacusai.app`) and has since been migrated to a standalone domain (`port0.me`). The codebase underwent a significant cleanup:

- **Removed:** 40+ unused shadcn/ui components, Prisma schema with no models, Abacus AI chat widget, HTML-to-PDF API integration, admin panel with hardcoded password
- **Fixed:** SSRF vulnerability in RSS proxy (domain allowlist), weather API now uses free Open-Meteo (no key needed), hardcoded domain references updated
- **Optimized:** Framer Motion replaced with CSS animations (saved 3.8 MB dependency), OG images compressed to WebP (97% savings), deprecated Next.js config cleaned

## License

MIT