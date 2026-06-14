/**
 * Pure, dependency-free normalisation for Instagram feed payloads.
 *
 * SECURITY: feed data comes from an external service, so every URL is
 * validated to be `https:` before it reaches the DOM. This prevents a
 * malicious/compromised feed from injecting a `javascript:` (or other
 * scheme) value into an anchor `href` or image `src`. Posts without a
 * valid https image are dropped rather than rendered broken.
 *
 * Kept import-free so it can be unit-tested directly.
 */

export type InstagramPost = {
  id: string;
  permalink: string;
  imageUrl: string;
  caption: string;
  isVideo: boolean;
};

/** Returns the URL string only if it is a well-formed https URL, else null. */
export function safeHttpsUrl(value: unknown): string | null {
  if (typeof value !== "string" || value.length === 0) return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url.toString() : null;
  } catch {
    return null;
  }
}

function captionText(c: unknown): string {
  if (typeof c === "string") return c;
  if (c && typeof c === "object" && "text" in c) {
    const t = (c as { text?: unknown }).text;
    return typeof t === "string" ? t : "";
  }
  return "";
}

// ---- Behold (https://behold.so) -------------------------------------------
type BeholdSize = { mediaUrl?: string };
type BeholdPost = {
  id?: string;
  permalink?: string;
  mediaType?: string;
  mediaUrl?: string;
  thumbnailUrl?: string;
  prunedCaption?: string;
  caption?: string | { text?: string };
  sizes?: { small?: BeholdSize; medium?: BeholdSize; large?: BeholdSize };
};
type BeholdResponse = BeholdPost[] | { posts?: BeholdPost[] };

export function normalizeBehold(
  data: unknown,
  fallbackPermalink: string,
  limit: number
): InstagramPost[] {
  const body = data as BeholdResponse;
  const posts: BeholdPost[] = Array.isArray(body) ? body : body?.posts ?? [];

  return posts
    .map((p, i): InstagramPost | null => {
      const imageUrl =
        safeHttpsUrl(p.sizes?.medium?.mediaUrl) ??
        safeHttpsUrl(p.sizes?.small?.mediaUrl) ??
        safeHttpsUrl(p.sizes?.large?.mediaUrl) ??
        safeHttpsUrl(p.thumbnailUrl) ??
        safeHttpsUrl(p.mediaUrl);
      if (!imageUrl) return null;
      return {
        id: p.id ?? String(i),
        permalink: safeHttpsUrl(p.permalink) ?? fallbackPermalink,
        imageUrl,
        caption: p.prunedCaption ?? captionText(p.caption),
        isVideo: p.mediaType === "VIDEO",
      };
    })
    .filter((p): p is InstagramPost => p !== null)
    .slice(0, limit);
}

// ---- Instagram Graph API --------------------------------------------------
type GraphPost = {
  id?: string;
  media_type?: string;
  media_url?: string;
  thumbnail_url?: string;
  permalink?: string;
  caption?: string;
};
type GraphResponse = { data?: GraphPost[] };

export function normalizeGraph(
  data: unknown,
  fallbackPermalink: string,
  limit: number
): InstagramPost[] {
  const posts = (data as GraphResponse)?.data ?? [];

  return posts
    .map((p, i): InstagramPost | null => {
      const raw = p.media_type === "VIDEO" ? p.thumbnail_url : p.media_url;
      const imageUrl = safeHttpsUrl(raw);
      if (!imageUrl) return null;
      return {
        id: p.id ?? String(i),
        permalink: safeHttpsUrl(p.permalink) ?? fallbackPermalink,
        imageUrl,
        caption: typeof p.caption === "string" ? p.caption : "",
        isVideo: p.media_type === "VIDEO",
      };
    })
    .filter((p): p is InstagramPost => p !== null)
    .slice(0, limit);
}
