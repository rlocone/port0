'use client';

import { useState, useEffect } from 'react';
import { ExternalLink, Newspaper, Sparkles, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface FeedItem {
  title?: string;
  description?: string;
  link?: string;
  pubDate?: string;
}

interface RSSCardProps {
  feedUrl: string;
  title: string;
  accentColor: 'purple' | 'cyan';
}

// Helper to get base URL from feed URL
function getBaseUrl(feedUrl: string): string {
  try {
    const url = new URL(feedUrl);
    return `${url.protocol}//${url.host}`;
  } catch {
    // Try to extract base URL manually
    const match = feedUrl?.match?.(/^(https?:\/\/[^\/]+)/);
    return match?.[1] ?? '';
  }
}

// Helper to ensure URL is absolute
function ensureAbsoluteUrl(link: string | undefined, baseUrl: string): string {
  if (!link || link === '#') return '#';
  
  // Already absolute
  if (link.startsWith('http://') || link.startsWith('https://')) {
    return link;
  }
  
  // No baseUrl available, can't fix
  if (!baseUrl) return link;
  
  // If it's a relative URL, prepend the base URL
  if (link.startsWith('/')) {
    return `${baseUrl}${link}`;
  }
  return `${baseUrl}/${link}`;
}

export default function RSSCard({ feedUrl, title, accentColor }: RSSCardProps) {
  const [items, setItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const baseUrl = getBaseUrl(feedUrl);

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`/api/rss?url=${encodeURIComponent(feedUrl)}`);
        if (!res?.ok) {
          throw new Error('Failed to fetch feed');
        }
        const data = await res?.json?.();
        setItems(data?.items ?? []);
      } catch (err) {
        setError('Unable to load feed');
        console.error('RSS fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeed?.();
  }, [feedUrl]);

  const glowClass = accentColor === 'purple' ? 'glow-purple' : 'glow-cyan';
  const iconColor = accentColor === 'purple' ? 'text-purple-400' : 'text-cyan-400';
  const borderHover = accentColor === 'purple' ? 'hover:border-purple-500/30' : 'hover:border-cyan-500/30';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`glass rounded-2xl p-6 ${glowClass} glass-hover transition-all duration-500 h-full`}
    >
      <div className="flex items-center gap-3 mb-6">
        {accentColor === 'purple' ? (
          <Sparkles className={`w-6 h-6 ${iconColor}`} />
        ) : (
          <Newspaper className={`w-6 h-6 ${iconColor}`} />
        )}
        <h2 className={`text-lg font-medium ${iconColor}`}>{title}</h2>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className={`w-8 h-8 ${iconColor} animate-spin`} />
        </div>
      )}

      {error && (
        <div className="text-center py-12 text-gray-400">
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && (items?.length ?? 0) === 0 && (
        <div className="text-center py-12 text-gray-400">
          <p>No articles found</p>
        </div>
      )}

      <div className="space-y-4">
        {(items ?? [])?.slice?.(0, 3)?.map?.((item, index) => (
          <motion.a
            key={index}
            href={ensureAbsoluteUrl(item?.link, baseUrl)}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`block p-4 rounded-xl bg-white/[0.02] border border-white/5 ${borderHover} transition-all duration-300 group`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-200 group-hover:text-white transition-colors line-clamp-2">
                  {item?.title ?? 'Untitled'}
                </h3>
                {item?.description && (
                  <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                    {item?.description?.replace?.(/<[^>]*>/g, '')?.slice?.(0, 120) ?? ''}
                    {(item?.description?.length ?? 0) > 120 ? '...' : ''}
                  </p>
                )}
              </div>
              <ExternalLink className={`w-4 h-4 ${iconColor} opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-1`} />
            </div>
          </motion.a>
        ))}
      </div>
    </motion.div>
  );
}
