import { site } from "@/lib/site";
import {
  normalizeBehold,
  normalizeGraph,
  type InstagramPost,
} from "@/lib/instagram-normalize";

export type { InstagramPost };

/**
 * Live Instagram feed.
 *
 * Works with EITHER provider — set one in `.env.local` and the feed goes live
 * automatically. If neither is set, `getInstagramPosts()` returns [] and the
 * gallery shows its styled placeholder grid.
 *
 *   1. Behold (easiest — no Meta app, free):
 *        BEHOLD_FEED_ID=your_feed_id
 *   2. Instagram Graph API (official, needs a Meta app + long-lived token):
 *        INSTAGRAM_TOKEN=your_long_lived_access_token
 *
 * Optional: BEHOLD_BASE_URL overrides the Behold host (self-hosted proxy / tests).
 *
 * Posts are fetched on the server and revalidated hourly (ISR). All URLs in the
 * payload are sanitised to https in the normalisers before they reach the DOM.
 */

const LIMIT = 8;
const REVALIDATE_SECONDS = 60 * 60; // 1 hour
const BEHOLD_BASE_URL =
  process.env.BEHOLD_BASE_URL?.trim() || "https://feeds.behold.so";

async function fetchBehold(feedId: string): Promise<InstagramPost[]> {
  const url = `${BEHOLD_BASE_URL}/${encodeURIComponent(feedId)}`;
  const res = await fetch(url, { next: { revalidate: REVALIDATE_SECONDS } });
  if (!res.ok) throw new Error(`Behold responded ${res.status}`);
  return normalizeBehold(await res.json(), site.instagram.url, LIMIT);
}

async function fetchGraph(token: string): Promise<InstagramPost[]> {
  const url = new URL("https://graph.instagram.com/me/media");
  url.searchParams.set(
    "fields",
    "id,media_type,media_url,thumbnail_url,permalink,caption"
  );
  url.searchParams.set("limit", String(LIMIT));
  url.searchParams.set("access_token", token);

  const res = await fetch(url, { next: { revalidate: REVALIDATE_SECONDS } });
  if (!res.ok) throw new Error(`Instagram Graph API responded ${res.status}`);
  return normalizeGraph(await res.json(), site.instagram.url, LIMIT);
}

export async function getInstagramPosts(): Promise<InstagramPost[]> {
  const beholdId = process.env.BEHOLD_FEED_ID?.trim();
  const token = process.env.INSTAGRAM_TOKEN?.trim();

  try {
    if (token) return await fetchGraph(token);
    if (beholdId) return await fetchBehold(beholdId);
  } catch (err) {
    // Don't break the page if the feed is briefly unavailable — fall back.
    console.error("[instagram] feed fetch failed:", err);
  }
  return [];
}
