'use client';

import { useState, useEffect } from 'react';
import { ExternalLink, GitCommit, Loader2 } from 'lucide-react';

interface CommitItem {
  title?: string;
  description?: string;
  link?: string;
  pubDate?: string;
  author?: string;
  repoName?: string;
  repoUrl?: string;
}

interface RepoSource {
  name: string;
  repoUrl: string;
  feedUrl: string;
}

const RLOCONE_REPOS: RepoSource[] = [
  {
    name: 'port0',
    repoUrl: 'https://github.com/rlocone/port0',
    feedUrl: 'https://github.com/rlocone/port0/commits/main.atom',
  },
  {
    name: 'ImZaDi',
    repoUrl: 'https://github.com/rlocone/ImZaDi',
    feedUrl: 'https://github.com/rlocone/ImZaDi/commits/main.atom',
  },
  {
    name: 'phpip.me-Contant-Hub',
    repoUrl: 'https://github.com/rlocone/phpip.me-Contant-Hub',
    feedUrl: 'https://github.com/rlocone/phpip.me-Contant-Hub/commits/master.atom',
  },
  {
    name: 'mission_control',
    repoUrl: 'https://github.com/rlocone/mission_control',
    feedUrl: 'https://github.com/rlocone/mission_control/commits/main.atom',
  },
];

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
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
    return '';
  } catch {
    return '';
  }
}

function extractCommitMessage(title: string | undefined): string {
  if (!title) return 'Untitled commit';
  const parts = title.split(' - ');
  if (parts.length > 1) {
    return parts.slice(1).join(' - ');
  }
  return title;
}

async function fetchRepoCommits(repo: RepoSource): Promise<CommitItem[]> {
  try {
    const res = await fetch(`/api/rss?url=${encodeURIComponent(repo.feedUrl)}`);
    if (!res.ok) {
      return [];
    }

    const data = await res.json();
    return (data.items ?? []).map((item: CommitItem) => ({
      ...item,
      repoName: repo.name,
      repoUrl: repo.repoUrl,
    }));
  } catch (error) {
    console.error(`Commits fetch error for ${repo.name}:`, error);
    return [];
  }
}

export default function CommitsFeed() {
  const [items, setItems] = useState<CommitItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        setLoading(true);
        setError(null);
        const responses = await Promise.all(RLOCONE_REPOS.map(fetchRepoCommits));
        const merged = responses
          .flat()
          .sort((a: CommitItem, b: CommitItem) => {
            const aTime = a.pubDate ? new Date(a.pubDate).getTime() : 0;
            const bTime = b.pubDate ? new Date(b.pubDate).getTime() : 0;
            return bTime - aTime;
          })
          .slice(0, 5);

        setItems(merged);
      } catch (err) {
        setError('Unable to load commits');
        console.error('Commits fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeed();
  }, []);

  return (
    <div
      className="glass rounded-2xl p-6 glow-cyan glass-hover transition-all duration-500 animate-fade-in-up"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <GitCommit className="w-6 h-6 text-cyan-400" />
          <h2 className="text-lg font-medium text-cyan-300">rlocone Repos</h2>
        </div>
        <a
          href="https://github.com/rlocone"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-gray-500 hover:text-cyan-400 transition-colors flex items-center gap-1"
        >
          <span>View rlocone</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
        </div>
      )}

      {error && (
        <div className="text-center py-12 text-gray-400">
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && items.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <p>No commits found</p>
        </div>
      )}

      <div className="space-y-3">
        {items.slice(0, 5).map((item, index) => {
          const relativeTime = getRelativeTime(item.pubDate);
          const commitMessage = extractCommitMessage(item.title);
          return (
            <a
              key={index}
              href={item.link ?? '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-cyan-500/30 transition-all duration-300 group animate-fade-in-left"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <div className="w-2 h-2 rounded-full bg-cyan-400 flex-shrink-0" />
                    {item.repoName && (
                      <span
                        title={item.repoUrl}
                        className="px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 text-[11px] font-medium"
                      >
                        {item.repoName}
                      </span>
                    )}
                    <p className="font-medium text-gray-200 group-hover:text-white transition-colors line-clamp-2 text-sm">
                      {commitMessage}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    {item.pubDate && (
                      <span className="text-gray-500">{formatDate(item.pubDate)}</span>
                    )}
                    {relativeTime && (
                      <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300">
                        {relativeTime}
                      </span>
                    )}
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-1" />
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}