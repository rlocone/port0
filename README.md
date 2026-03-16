<div align="center">

<!-- Portal Header -->
<br />

```
 ██████╗  ██████╗ ██████╗ ████████╗ █████╗ ██╗     
 ██╔══██╗██╔═══██╗██╔══██╗╚══██╔══╝██╔══██╗██║     
 ██████╔╝██║   ██║██████╔╝   ██║   ███████║██║     
 ██╔═══╝ ██║   ██║██╔══██╗   ██║   ██╔══██║██║     
 ██║     ╚██████╔╝██║  ██║   ██║   ██║  ██║███████╗
 ╚═╝      ╚═════╝ ╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═╝╚══════╝
```

### ✦ Your personal gateway to inspiration ✦

**A glassmorphism-styled personal dashboard & digital resume — built with Next.js 14, Tailwind CSS, and Framer Motion.**

[![Live](https://img.shields.io/badge/▸_LIVE-port0.me-7c3aed?style=for-the-badge&labelColor=0a0a0f)](https://port0.me)
[![Next.js](https://img.shields.io/badge/Next.js-14-0a0a0f?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2-0a0a0f?style=for-the-badge&logo=typescript&logoColor=06b6d4)](https://www.typescriptlang.org)
[![Tailwind](https://img.shields.io/badge/Tailwind-3.3-0a0a0f?style=for-the-badge&logo=tailwindcss&logoColor=06b6d4)](https://tailwindcss.com)

<br />

<img src="https://img.shields.io/badge/━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━-7c3aed?style=flat-square" />

</div>

<br />

## ✦ Overview

**Portal** is a personal start-page and digital resume hosted at [port0.me](https://port0.me). It merges a dark, ethereal aesthetic — deep purples (`#7c3aed`), electric cyans (`#06b6d4`), and frosted-glass panels — with practical, real-time information widgets. Everything renders server-side where possible and hydrates gracefully on the client.

<br />

## ✦ Features

### 🕐 Real-Time Digital Clock
A precision clock card displaying the current time with pipe-separated metadata: **Unix timestamp** `|` **ISO 8601 date** `|` **week number** `|` **day of year** `|` **current quarter**. Updates every second with smooth transitions.

### 🌦 Weather Card
Geolocation-aware weather widget pulling real-time conditions, temperature, humidity, and wind speed. Falls back to a default location when permissions are unavailable.

### 🔗 Social Links Hub
Customizable social links grid with automatic favicon fetching and platform icon detection. Links are persisted in `localStorage` and can be managed from an admin panel. Default links include Facebook, GitHub, and personal project sites.

### 📰 RSS Feed Reader
Dual RSS feed cards pulling the latest posts from [Imzadi](https://imzadi.love) and [PhiPi Tech](https://phipi.me) through a server-side proxy at `/api/rss`. Feeds are parsed and rendered with publication dates and external links.

### 📊 Reports Feed
Aggregates the latest published reports from [Rose](https://rose.abacusai.app) with formatted dates and direct links to each report.

### 💻 GitHub Commits Feed
Displays recent commit activity across repositories, showing commit messages, authors, and timestamps — pulled via RSS and rendered in a clean timeline.

### 📄 Interactive Resume
A full-page, animated resume at `/resume` featuring:
- **Professional summary** with role title and contact details
- **Work experience** timeline with expandable role descriptions
- **Technical skills** organized by domain (Security, Networking, Systems, etc.)
- **Education & certifications** with institution details
- **One-click PDF download** of a polished CV via `/api/generate-cv-pdf`
- **Open Graph & Twitter Card** metadata for rich social previews when shared

### 🔧 Admin Panel
A lightweight admin page at `/admin` for managing social links and dashboard configuration without touching code.

<br />

## ✦ Tech Stack

```
Framework       Next.js 14 (App Router, Server Components)
Language        TypeScript 5.2
Styling         Tailwind CSS 3.3 + custom glassmorphism utilities
Animations      Framer Motion 10
UI Components   Radix UI primitives + shadcn/ui
Icons           Lucide React
PDF Generation  Abacus AI HTML-to-PDF API (Playwright-backed)
Deployment      Abacus AI Hosted Platform → port0.me
```

<br />

## ✦ Project Structure

```
portal/nextjs_space/
├── app/
│   ├── layout.tsx              # Root layout, OG metadata, global fonts
│   ├── page.tsx                # Homepage — clock, weather, feeds, links
│   ├── globals.css             # Tailwind + glassmorphism + glow utilities
│   ├── resume/
│   │   ├── layout.tsx          # Resume-specific OG/Twitter metadata
│   │   └── page.tsx            # Full interactive resume page
│   ├── admin/
│   │   └── page.tsx            # Social links admin panel
│   └── api/
│       ├── weather/route.ts    # Weather data proxy
│       ├── rss/route.ts        # RSS feed fetcher & parser
│       └── generate-cv-pdf/    # PDF generation endpoint
│           └── route.ts
├── components/
│   ├── digital-clock.tsx       # Real-time clock with metadata
│   ├── weather-card.tsx        # Geolocation weather widget
│   ├── social-links.tsx        # Customizable social grid
│   ├── rss-card.tsx            # RSS feed display card
│   ├── reports-feed.tsx        # Reports aggregator
│   ├── commits-feed.tsx        # GitHub commits timeline
│   └── ui/                     # shadcn/ui component library
├── public/
│   ├── favicon.svg             # Portal favicon
│   ├── og-image.png            # Open Graph image (homepage)
│   ├── og-resume.png           # Open Graph image (resume)
│   └── CV_Revised.pdf          # Downloadable CV
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── postcss.config.js
```

<br />

## ✦ Design System

The visual language is built on a **dark ethereal glassmorphism** theme:

| Token | Value | Usage |
|---|---|---|
| `--background` | `#0a0a0f` | Base background |
| `--primary` | `hsl(270 60% 60%)` | Purple accents, headings, glows |
| `--secondary` | `hsl(190 80% 50%)` | Cyan accents, secondary highlights |
| `--card` | `hsl(0 0% 8%)` | Card surfaces |
| `--border` | `hsl(0 0% 20%)` | Subtle borders |
| `--muted` | `hsl(0 0% 15%)` | Muted backgrounds |

The background uses a **135° gradient** from `#0a0a0f` → `#1a0a2e` → `#0f1419`, overlaid with animated gradient orbs for depth. Glass panels use `backdrop-blur` with low-opacity white borders to create the frosted effect.

Key CSS utilities:
- `.glass` — frosted glass panel with blur + subtle border
- `.gradient-text` — purple-to-cyan gradient text
- `.glow-purple` / `.glow-cyan` — colored box-shadow glows
- `.animate-float` — gentle floating animation for cards

<br />

## ✦ API Routes

| Endpoint | Method | Description |
|---|---|---|
| `/api/weather` | `GET` | Proxies weather data based on lat/lon query params |
| `/api/rss` | `GET` | Fetches and parses RSS feeds from a given `url` param |
| `/api/generate-cv-pdf` | `GET` | Generates a styled PDF of the resume via HTML-to-PDF |

<br />

## ✦ Getting Started

```bash
# Clone the repository
git clone https://github.com/rlocone/portal.git
cd portal/nextjs_space

# Install dependencies
yarn install

# Set up environment variables
cp .env.example .env
# Edit .env with your API keys

# Start the development server
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

<br />

## ✦ Environment Variables

| Variable | Required | Description |
|---|---|---|
| `NEXTAUTH_URL` | Yes | Production URL (e.g., `https://port0.me`) |
| `WEATHER_API_KEY` | No | OpenWeatherMap API key for the weather widget |

<br />

## ✦ Deployment

Portal is deployed and hosted on the **Abacus AI** platform, serving traffic at:

- **Primary:** [port0.abacusai.app](https://port0.abacusai.app)
- **Custom domain:** [port0.me](https://port0.me)

The build process creates a standalone Next.js bundle optimized for production with server-side rendering.

<br />

## ✦ License

This project is personal and not currently licensed for redistribution.

<br />

<div align="center">

<img src="https://img.shields.io/badge/━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━-7c3aed?style=flat-square" />

<br />
<br />

**Crafted with 💜 in the ethereal realm**

[port0.me](https://port0.me)

</div>
