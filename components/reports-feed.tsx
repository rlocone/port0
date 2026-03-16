'use client';

import { useState, useEffect } from 'react';
import { ExternalLink, FileText, Loader2, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

interface ReportItem {
  title?: string;
  description?: string;
  link?: string;
  pubDate?: string;
}

function formatDate(dateString: string | undefined): string {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateString;
  }
}

function getRelativeTime(dateString: string | undefined): string {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return '';
  } catch {
    return '';
  }
}

export default function ReportsFeed() {
  const [items, setItems] = useState<ReportItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`/api/rss?url=${encodeURIComponent('https://rose.abacusai.app/api/feeds/all.xml')}`);
        if (!res?.ok) {
          throw new Error('Failed to fetch feed');
        }
        const data = await res?.json?.();
        setItems(data?.items ?? []);
      } catch (err) {
        setError('Unable to load reports');
        console.error('RSS fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeed?.();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass rounded-2xl p-6 glow-purple glass-hover transition-all duration-500"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <FileText className="w-6 h-6 text-purple-400" />
          <h2 className="text-lg font-medium text-purple-300">Rose Reports</h2>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <RefreshCw className="w-3 h-3" />
          <span>Refreshed daily</span>
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
        </div>
      )}

      {error && (
        <div className="text-center py-12 text-gray-400">
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && (items?.length ?? 0) === 0 && (
        <div className="text-center py-12 text-gray-400">
          <p>No reports found</p>
        </div>
      )}

      <div className="space-y-4">
        {(items ?? [])?.slice?.(0, 5)?.map?.((item, index) => {
          const relativeTime = getRelativeTime(item?.pubDate);
          return (
            <motion.a
              key={index}
              href={item?.link ?? '#'}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="block p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-purple-500/30 transition-all duration-300 group"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-200 group-hover:text-white transition-colors line-clamp-2">
                    {item?.title ?? 'Untitled'}
                  </h3>
                  {item?.description && (
                    <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                      {item?.description?.replace?.(/<[^>]*>/g, '')?.slice?.(0, 150) ?? ''}
                      {(item?.description?.length ?? 0) > 150 ? '...' : ''}
                    </p>
                  )}
                  {item?.pubDate && (
                    <div className="flex items-center gap-2 mt-3 text-xs">
                      <span className="text-gray-500">{formatDate(item?.pubDate)}</span>
                      {relativeTime && (
                        <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300">
                          {relativeTime}
                        </span>
                      )}
                    </div>
                  )}
                </div>
                <ExternalLink className="w-4 h-4 text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-1" />
              </div>
            </motion.a>
          );
        })}
      </div>
    </motion.div>
  );
}
