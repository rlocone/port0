import DigitalClock from '@/components/digital-clock';
import RSSCard from '@/components/rss-card';
import WeatherCard from '@/components/weather-card';
import SocialLinks from '@/components/social-links';
import ReportsFeed from '@/components/reports-feed';
import CommitsFeed from '@/components/commits-feed';
import { Sparkles, RefreshCw, FileText } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen relative z-10">
      {/* Header */}
      <header className="py-8 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 mb-2">
            <Sparkles className="w-6 h-6 text-purple-400" />
            <h1 className="text-3xl md:text-4xl font-light gradient-text">Portal</h1>
            <Sparkles className="w-6 h-6 text-cyan-400" />
          </div>
          <p className="text-gray-400 text-sm">Your personal gateway to inspiration</p>
          <Link 
            href="/resume" 
            className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-purple-500/30 transition-all duration-300"
          >
            <FileText className="w-4 h-4" />
            <span className="text-sm">Resume & CV</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 pb-12 space-y-8">
        {/* Clock Section */}
        <section className="animate-float" style={{ animationDuration: '8s' }}>
          <DigitalClock />
        </section>

        {/* Weather & Social Section */}
        <section className="grid md:grid-cols-2 gap-6">
          <WeatherCard />
          <SocialLinks />
        </section>

        {/* RSS Feeds Section */}
        <section>
          <h2 className="text-xl font-light text-gray-300 mb-6 text-center">
            Latest <span className="gradient-text">Inspirations</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <RSSCard
              feedUrl="https://imzadi.love/api/feed"
              title="Imzadi"
              accentColor="purple"
            />
            <RSSCard
              feedUrl="https://phipi.me/api/feed"
              title="PhiPi"
              accentColor="cyan"
            />
          </div>
        </section>

        {/* Rose Reports Section */}
        <section>
          <h2 className="text-xl font-light text-gray-300 mb-6 text-center">
            Latest <span className="gradient-text">Reports</span>
          </h2>
          <ReportsFeed />
        </section>

        {/* GitHub Commits Section */}
        <section>
          <h2 className="text-xl font-light text-gray-300 mb-6 text-center">
            Latest <span className="gradient-text">Commits</span>
          </h2>
          <CommitsFeed />
        </section>

        {/* Feed Refresh Note */}
        <section className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
            <RefreshCw className="w-4 h-4 text-cyan-400" />
            <span className="text-sm text-gray-400">RSS feeds are refreshed daily</span>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="py-8 text-center">
        <p className="text-gray-500 text-sm">
          Crafted with <span className="text-purple-400">♥</span> in the ethereal realm
        </p>
      </footer>
    </main>
  );
}
