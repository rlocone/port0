import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

interface FeedItem {
  title?: string;
  description?: string;
  link?: string;
  pubDate?: string;
  author?: string;
}

function parseRSSItems(xml: string): FeedItem[] {
  const items: FeedItem[] = [];
  
  try {
    const itemRegex = /<item[^>]*>([\s\S]*?)<\/item>/gi;
    const itemMatches = xml?.match?.(itemRegex) ?? [];

    for (const itemXml of itemMatches ?? []) {
      const titleMatch = itemXml?.match?.(/<title[^>]*>(?:<\!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/i);
      const descMatch = itemXml?.match?.(/<description[^>]*>(?:<\!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/description>/i);
      const linkMatch = itemXml?.match?.(/<link[^>]*>(?:<\!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/link>/i);
      const pubDateMatch = itemXml?.match?.(/<pubDate[^>]*>(?:<\!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/pubDate>/i);

      items?.push?.({
        title: titleMatch?.[1]?.trim?.() ?? '',
        description: descMatch?.[1]?.trim?.() ?? '',
        link: linkMatch?.[1]?.trim?.() ?? '',
        pubDate: pubDateMatch?.[1]?.trim?.() ?? '',
      });
    }
  } catch (e) {
    console?.error?.('RSS parsing error:', e);
  }

  return items;
}

function parseAtomItems(xml: string): FeedItem[] {
  const items: FeedItem[] = [];
  
  try {
    const entryRegex = /<entry[^>]*>([\s\S]*?)<\/entry>/gi;
    const entryMatches = xml?.match?.(entryRegex) ?? [];

    for (const entryXml of entryMatches ?? []) {
      const titleMatch = entryXml?.match?.(/<title[^>]*>(?:<\!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/i);
      // Atom uses <summary> or <content> for description
      const summaryMatch = entryXml?.match?.(/<summary[^>]*>(?:<\!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/summary>/i);
      // Atom uses <link href="..."/> attribute for URL
      const linkMatch = entryXml?.match?.(/<link[^>]*href=["']([^"']+)["'][^>]*rel=["']alternate["'][^>]*\/?>/i) 
                     ?? entryXml?.match?.(/<link[^>]*rel=["']alternate["'][^>]*href=["']([^"']+)["'][^>]*\/?>/i)
                     ?? entryXml?.match?.(/<link[^>]*href=["']([^"']+)["'][^>]*\/?>/i);
      // Atom uses <updated> or <published> for dates
      const dateMatch = entryXml?.match?.(/<published[^>]*>([\s\S]*?)<\/published>/i) 
                     ?? entryXml?.match?.(/<updated[^>]*>([\s\S]*?)<\/updated>/i);
      // Extract author name
      const authorMatch = entryXml?.match?.(/<author[^>]*>[\s\S]*?<name[^>]*>([\s\S]*?)<\/name>[\s\S]*?<\/author>/i);

      items?.push?.({
        title: titleMatch?.[1]?.trim?.() ?? '',
        description: summaryMatch?.[1]?.trim?.() ?? '',
        link: linkMatch?.[1]?.trim?.() ?? '',
        pubDate: dateMatch?.[1]?.trim?.() ?? '',
        author: authorMatch?.[1]?.trim?.() ?? '',
      });
    }
  } catch (e) {
    console?.error?.('Atom parsing error:', e);
  }

  return items;
}

function parseXMLtoItems(xml: string): FeedItem[] {
  // Check if it's an Atom feed (has <feed> root or <entry> elements)
  const isAtom = /<feed[^>]*xmlns=["']http:\/\/www\.w3\.org\/2005\/Atom["']/i.test(xml) 
              || /<entry[^>]*>/i.test(xml);
  
  if (isAtom) {
    return parseAtomItems(xml);
  }
  
  return parseRSSItems(xml);
}

function parseJSONFeed(data: Record<string, unknown>): FeedItem[] {
  const items: FeedItem[] = [];
  
  try {
    const feedItems = (data?.items ?? data?.entries ?? data?.posts ?? []) as Array<Record<string, unknown>>;
    
    for (const item of feedItems ?? []) {
      items?.push?.({
        title: (item?.title ?? item?.name ?? '') as string,
        description: (item?.description ?? item?.summary ?? item?.content ?? item?.content_text ?? item?.content_html ?? '') as string,
        link: (item?.link ?? item?.url ?? item?.href ?? '') as string,
        pubDate: (item?.pubDate ?? item?.published ?? item?.date ?? item?.date_published ?? '') as string,
      });
    }
  } catch (e) {
    console?.error?.('JSON parsing error:', e);
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

function fixItemLinks(items: FeedItem[], sourceBaseUrl: string): FeedItem[] {
  return (items ?? []).map((item) => {
    let link = item?.link ?? '';
    
    // If link is relative, make it absolute with source domain
    if (link && !link.startsWith('http://') && !link.startsWith('https://')) {
      if (link.startsWith('/')) {
        link = `${sourceBaseUrl}${link}`;
      } else {
        link = `${sourceBaseUrl}/${link}`;
      }
    }
    
    // Fix URLs that point to wrong preview domains
    if (link && sourceBaseUrl) {
      try {
        const linkUrl = new URL(link);
        const sourceUrl = new URL(sourceBaseUrl);
        if (linkUrl.host.includes('.preview.abacusai.app') || linkUrl.host.includes('localhost')) {
          // Normalize pathname to remove double slashes
          let pathname = linkUrl.pathname.replace(/^\/+/, '/');
          link = `${sourceUrl.protocol}//${sourceUrl.host}${pathname}${linkUrl.search}${linkUrl.hash}`;
        }
      } catch {
        // Keep original link if URL parsing fails
      }
    }
    
    // Final cleanup: fix any remaining double slashes in the path (not in protocol)
    link = link.replace(/([^:])\/\/+/g, '$1/');
    
    return { ...item, link };
  });
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request?.nextUrl?.searchParams;
    const feedUrl = searchParams?.get?.('url');

    if (!feedUrl) {
      return NextResponse.json(
        { error: 'Feed URL is required' },
        { status: 400 }
      );
    }

    const sourceBaseUrl = getBaseUrlFromFeed(feedUrl);

    const response = await fetch(feedUrl, {
      headers: {
        'Accept': 'application/rss+xml, application/xml, application/json, text/xml, */*',
        'User-Agent': 'Portal/1.0',
      },
      cache: 'no-store',
    });

    if (!response?.ok) {
      throw new Error(`Failed to fetch feed: ${response?.status}`);
    }

    const contentType = response?.headers?.get?.('content-type') ?? '';
    const text = await response?.text?.();

    let items: FeedItem[] = [];

    if (contentType?.includes?.('json') || text?.trim?.()?.startsWith?.('{') || text?.trim?.()?.startsWith?.('[')) {
      try {
        const jsonData = JSON?.parse?.(text ?? '{}');
        items = parseJSONFeed(jsonData ?? {});
      } catch {
        items = parseXMLtoItems(text ?? '');
      }
    } else {
      items = parseXMLtoItems(text ?? '');
    }

    // Fix any incorrect URLs
    items = fixItemLinks(items, sourceBaseUrl);

    return NextResponse.json({
      items: items?.slice?.(0, 10) ?? [],
    });
  } catch (error) {
    console?.error?.('RSS API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch feed', items: [] },
      { status: 500 }
    );
  }
}
