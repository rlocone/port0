'use client';

import { useState, useEffect } from 'react';
import { ExternalLink, Settings, Facebook, Twitter, Instagram, Linkedin, Github, Youtube, Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  favicon?: string;
}

const defaultLinks: SocialLink[] = [
  { id: '1', platform: 'Facebook', url: 'https://www.facebook.com/ImZaDi0' },
  { id: '2', platform: 'GitHub', url: 'https://github.com/rlocone' },
  { id: '3', platform: 'Imzadi', url: 'https://imzadi.love/', favicon: 'https://imzadi.love/favicon.svg' },
  { id: '4', platform: 'PhiPi', url: 'https://phipi.io/', favicon: 'https://phipi.io/favicon.svg' },
  { id: '5', platform: 'Rose', url: 'https://rose.abacusai.app/', favicon: 'https://rose.abacusai.app/favicon.svg' },
  { id: '6', platform: 'PhiPi Tech', url: 'https://phipi.me/', favicon: 'https://phipi.me/favicon.svg' },
];

const platformIcons: Record<string, React.ReactNode> = {
  Facebook: <Facebook className="w-5 h-5" />,
  Twitter: <Twitter className="w-5 h-5" />,
  Instagram: <Instagram className="w-5 h-5" />,
  LinkedIn: <Linkedin className="w-5 h-5" />,
  GitHub: <Github className="w-5 h-5" />,
  YouTube: <Youtube className="w-5 h-5" />,
};

function FaviconIcon({ favicon, platform }: { favicon?: string; platform: string }) {
  const [error, setError] = useState(false);
  
  if (!favicon || error) {
    return platformIcons?.[platform] ?? <Globe className="w-5 h-5" />;
  }
  
  return (
    <Image
      src={favicon}
      alt={platform}
      width={20}
      height={20}
      className="w-5 h-5 rounded-sm"
      onError={() => setError(true)}
      unoptimized
    />
  );
}

export function getSocialLinks(): SocialLink[] {
  if (typeof window === 'undefined') return defaultLinks;
  try {
    const stored = localStorage?.getItem?.('portalSocialLinks');
    if (stored) {
      return JSON?.parse?.(stored) ?? defaultLinks;
    }
  } catch (e) {
    console.error('Error reading social links:', e);
  }
  return defaultLinks;
}

export function saveSocialLinks(links: SocialLink[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage?.setItem?.('portalSocialLinks', JSON?.stringify?.(links ?? []));
  } catch (e) {
    console.error('Error saving social links:', e);
  }
}

export default function SocialLinks() {
  const [mounted, setMounted] = useState(false);
  const [links, setLinks] = useState<SocialLink[]>(defaultLinks);

  useEffect(() => {
    setMounted(true);
    setLinks(getSocialLinks());
  }, []);

  if (!mounted) {
    return (
      <div className="glass rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-medium text-purple-300">Connect</h2>
        </div>
        <div className="text-center py-4 text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="glass rounded-2xl p-6 glass-hover transition-all duration-500"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-medium text-purple-300">Connect</h2>
        <Link
          href="/admin"
          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
          title="Admin Panel"
        >
          <Settings className="w-4 h-4 text-gray-400" />
        </Link>
      </div>

      {(links?.length ?? 0) === 0 ? (
        <div className="text-center py-4 text-gray-400">
          <p>No social links yet</p>
        </div>
      ) : (
        <div className="flex flex-wrap gap-3">
          {(links ?? [])?.map?.((link, index) => (
            <motion.a
              key={link?.id ?? index}
              href={link?.url ?? '#'}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-white/10 hover:border-purple-500/30 hover:from-purple-500/20 hover:to-cyan-500/20 transition-all duration-300 group"
            >
              <span className="text-purple-400 group-hover:text-purple-300 transition-colors">
                <FaviconIcon favicon={link?.favicon} platform={link?.platform ?? ''} />
              </span>
              <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                {link?.platform ?? 'Link'}
              </span>
              <ExternalLink className="w-3 h-3 text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.a>
          ))}
        </div>
      )}
    </motion.div>
  );
}
