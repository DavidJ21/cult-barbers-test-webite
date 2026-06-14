import { ArrowUpRight } from "lucide-react";
import { InstagramIcon } from "@/components/icons";
import { getInstagramPosts } from "@/lib/instagram";
import { site } from "@/lib/site";

export async function InstagramFeed() {
  const posts = await getInstagramPosts();

  if (posts.length === 0) {
    // Not configured (or feed temporarily unavailable) → styled placeholders.
    return (
      <>
        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <a
              key={i}
              href={site.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-dot-grid group relative flex aspect-square items-center justify-center overflow-hidden rounded-lg border bg-muted/40 transition-colors hover:border-foreground/30"
              aria-label="View on Instagram"
            >
              <InstagramIcon className="size-6 text-muted-foreground/40 transition-colors group-hover:text-brand" />
            </a>
          ))}
        </div>
        <p className="mt-6 text-center text-xs text-muted-foreground/70">
          Placeholder grid — set BEHOLD_FEED_ID or INSTAGRAM_TOKEN in
          .env.local to show the live feed (see README).
        </p>
      </>
    );
  }

  return (
    <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
      {posts.map((post) => (
        <a
          key={post.id}
          href={post.permalink}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative block aspect-square overflow-hidden rounded-lg border bg-muted/40"
          aria-label={post.caption ? post.caption.slice(0, 80) : "View on Instagram"}
        >
          {/* Instagram CDN URLs are external + rotate hourly, so a plain img
              (no next/image remote config) is the most robust choice here. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.imageUrl}
            alt={post.caption ? post.caption.slice(0, 120) : "Instagram post"}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 flex items-center justify-center gap-1 bg-black/0 text-white opacity-0 transition group-hover:bg-black/40 group-hover:opacity-100">
            <InstagramIcon className="size-5" />
            <ArrowUpRight className="size-4" />
          </div>
        </a>
      ))}
    </div>
  );
}
