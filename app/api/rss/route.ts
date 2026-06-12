import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const ALLOWED_FEED_DOMAINS = [
  'imzadi.love',
  'phipi.me',
  'phipi.io',
  'rose.abacusai.app',
  'github.com',
];

interface FeedItem {
  title?: string;
  description?: string;
  link?: string;
  pubDate?: string;
  author?: string;
}

function parseRSSItems(xml: string): FeedItem[] {
  const items: FeedItem[] = [];
  const itemRegex = /<item[^>]*>([\s\S]*?)<\/item>/gi;
  let match;

  while ((match = itemRegex.exec(xml)) !== null) {
    const itemXml = match[1];
    const titleMatch = itemXml.match(/<title[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/i);
    const descMatch = itemXml.match(/<description[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/description>/i);
    const linkMatch = itemXml.match(/<link[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/link>/i);
    const pubDateMatch = itemXml.match(/<pubDate[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/pubDate>/i);

    items.push({
      title: titleMatch?.[1]?.trim() ?? '',
      description: descMatch?.[1]?.trim() ?? '',
      link: linkMatch?.[1]?.trim() ?? '',
      pubDate: pubDateMatch?.[1]?.trim() ?? '',
    });
  }

  return items;
}

function parseAtomItems(xml: string): FeedItem[] {
  const items: FeedItem[] = [];
  const entryRegex = /<entry[^>]*>([\s\S]*?)<\/entry>/gi;
  let match;

  while ((match = entryRegex.exec(xml)) !== null) {
    const entryXml = match[1];
    const titleMatch = entryXml.match(/<title[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/i);
    const summaryMatch = entryXml.match(/<summary[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/summary>/i);
    const linkMatch = entryXml.match(/<link[^>]*href=["']([^"']+)["'][^>]*\/?>/i);
    const dateMatch = entryXml.match(/<published[^>]*>([\s\S]*?)<\/published>/i)
                  ?? entryXml.match(/<updated[^>]*>([\s\S]*?)<\/updated>/i);
    const authorMatch = entryXml.match(/<author[^>]*>[\s\S]*?<name[^>]*>([\s\S]*?)<\/name>[\s\S]*?<\/author>/i);

    items.push({
      title: titleMatch?.[1]?.trim() ?? '',
      description: summaryMatch?.[1]?.trim() ?? '',
      link: linkMatch?.[1]?.trim() ?? '',
      pubDate: dateMatch?.[1]?.trim() ?? '',
      author: authorMatch?.[1]?.trim() ?? '',
    });
  }

  return items;
}

function parseXMLtoItems(xml: string): FeedItem[] {
  const isAtom = /<feed[^>]*xmlns=["']http:\/\/www\.w3\.org\/2005\/Atom["']/i.test(xml)
              || /<entry[^>]*>/i.test(xml);

  if (isAtom) {
    return parseAtomItems(xml);
  }

  return parseRSSItems(xml);
}

function parseJSONFeed(data: Record<string, unknown>): FeedItem[] {
  const items: FeedItem[] = [];
  const feedItems = (data.items ?? data.entries ?? data.posts ?? []) as Array<Record<string, unknown>>;

  for (const item of feedItems) {
    items.push({
      title: (item.title ?? item.name ?? '') as string,
      description: (item.description ?? item.summary ?? item.content_text ?? item.content_html ?? item.content ?? '') as string,
      link: (item.link ?? item.url ?? item.href ?? '') as string,
      pubDate: (item.pubDate ?? item.published ?? item.date ?? item.date_published ?? '') as string,
    });
  }

  return items;
}

function getBaseUrlFromFeed(feedUrl: string): string {
  try {
    const url = new URL(feedUrl);
    return `${url.protocol}//${url.host}`;
  } catch {
    return '';
  }
}

function isAllowedFeedUrl(urlStr: string): boolean {
  try {
    const url = new URL(urlStr);
    return url.protocol === 'https:' && ALLOWED_FEED_DOMAINS.some(d => url.hostname === d || url.hostname.endsWith('.' + d));
  } catch {
    return false;
  }
}

function fixItemLinks(items: FeedItem[], sourceBaseUrl: string): FeedItem[] {
  return items.map((item) => {
    let link = item.link ?? '';

    // If link is relative, make it absolute with source domain
    if (link && !link.startsWith('http://') && !link.startsWith('https://')) {
      if (link.startsWith('/')) {
        link = `${sourceBaseUrl}${link}`;
      } else {
        link = `${sourceBaseUrl}/${link}`;
      }
    }

    // Fix URLs that point to localhost (dev server artifacts)
    if (link && sourceBaseUrl) {
      try {
        const linkUrl = new URL(link);
        const sourceUrl = new URL(sourceBaseUrl);
        if (linkUrl.hostname === 'localhost' || linkUrl.hostname === '127.0.0.1') {
          let pathname = linkUrl.pathname.replace(/^\/+/, '/');
          link = `${sourceUrl.protocol}//${sourceUrl.host}${pathname}${linkUrl.search}${linkUrl.hash}`;
        }
      } catch {
        // Keep original link if URL parsing fails
      }
    }

    // Fix any remaining double slashes in the path (not in protocol)
    link = link.replace(/([^:])\/\/+/g, '$1/');

    return { ...item, link };
  });
}

export async function GET(request: NextRequest) {
  const feedUrl = request.nextUrl.searchParams.get('url');

  if (!feedUrl) {
    return NextResponse.json(
      { error: 'Feed URL is required' },
      { status: 400 }
    );
  }

  // SSRF protection: only allow predefined feed domains
  if (!isAllowedFeedUrl(feedUrl)) {
    return NextResponse.json(
      { error: 'Feed domain not allowed' },
      { status: 403 }
    );
  }

  try {
    const sourceBaseUrl = getBaseUrlFromFeed(feedUrl);

    const response = await fetch(feedUrl, {
      headers: {
        'Accept': 'application/rss+xml, application/xml, application/json, text/xml, */*',
        'User-Agent': 'Portal/1.0',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch feed: ${response.status}`);
    }

    const contentType = response.headers.get('content-type') ?? '';
    const text = await response.text();

    let items: FeedItem[] = [];

    if (contentType.includes('json') || text.trim().startsWith('{') || text.trim().startsWith('[')) {
      try {
        const jsonData = JSON.parse(text);
        items = parseJSONFeed(jsonData);
      } catch {
        items = parseXMLtoItems(text);
      }
    } else {
      items = parseXMLtoItems(text);
    }

    // Fix any incorrect URLs
    items = fixItemLinks(items, sourceBaseUrl);

    return NextResponse.json({
      items: items.slice(0, 10),
    });
  } catch (error) {
    console.error('RSS API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch feed', items: [] },
      { status: 500 }
    );
  }
}