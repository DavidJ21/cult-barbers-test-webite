# Cult Barber Studio — Website (Next.js + shadcn/ui)

A modern marketing site for Cult Barber Studio (Tyabb, VIC), built with **Next.js 16**,
**Tailwind v4**, **shadcn/ui** (Base UI variant), and the **Geist** typeface — following
Vercel's design language: clean type, generous whitespace, subtle borders, restrained colour.

## Run it

```bash
npm install        # if needed
npm run dev        # dev server → http://localhost:3000
npm run build      # production build (static export-ready)
npm start          # serve the production build
```

## Project structure

```
src/
  app/
    layout.tsx        # Geist fonts, metadata
    page.tsx          # the full landing page (all sections)
    globals.css       # design tokens + Vercel-style utilities
  components/
    site-header.tsx   # sticky nav + mobile Sheet menu (client)
    site-footer.tsx
    icons.tsx         # InstagramIcon (lucide dropped brand glyphs)
    ui/               # shadcn components (button, card, badge, separator, sheet, accordion)
  lib/
    site.ts           # ALL content lives here — edit this to update the site
    utils.ts          # cn() helper
```

### Editing content
Everything (services, prices, team bios, contact details, booking + Instagram URLs,
promo code) is in **`src/lib/site.ts`**. Change it there and every section updates.

## Design notes (Vercel / Geist)
- **Font:** Geist Sans + Geist Mono via `next/font` (self-hosted, no layout shift).
- **Palette:** shadcn neutral base + a single brand accent (`--brand`, a muted clay) used
  sparingly on labels, prices, and the logo — defined in `globals.css` for light and dark.
- **Components:** Button, Card, Badge, Separator, Sheet (mobile nav). Note this shadcn build
  uses **Base UI** primitives, so composition uses the `render` prop (not `asChild`), and
  link-styled buttons use `buttonVariants()` on `<a>` tags.

## Already wired in (live data)
- **Square booking:** all "Book" buttons → the studio's real Square appointment URL.
- **Instagram:** links to `@cult.barber.studio`.
- **Contact:** Warehouse 23, 4 Peacock Road, Tyabb VIC 3912 · +61 483 797 635 · email · map.

## Live Instagram feed
The gallery is **wired to pull live posts** server-side (cached + revalidated hourly), with a
graceful fallback to the styled placeholder grid until a credential is set. Supports two
providers — set ONE in `.env.local` (copy from `.env.example`), then restart:

```bash
# Easiest — Behold (free, no Meta app): https://behold.so → connect IG → copy Feed ID
BEHOLD_FEED_ID=your_feed_id

# OR the official Instagram Graph API (needs a Meta app + long-lived token)
INSTAGRAM_TOKEN=your_long_lived_token
```

Fetch + normalisation logic: [`src/lib/instagram.ts`](src/lib/instagram.ts).
Rendering (real posts vs. fallback): [`src/components/instagram-feed.tsx`](src/components/instagram-feed.tsx).
Verified end-to-end with sample data — once you add a Feed ID, the real grid renders automatically.

## To finish
1. **Team photos** — headshots are styled monograms. Replace the `aspect-[4/3]` blocks in
   `page.tsx` with `next/image` `<Image>` tags pointing at photos in `/public`.
2. **Instagram** — add your `BEHOLD_FEED_ID` (see above) to go live.
3. **Opening hours** — currently "by appointment only"; add specific times in `site.ts` if published.
4. **Email** — confirm `management@cultbarberstudio.com` (the site shows a variant spelling).

## shadcn MCP server
The shadcn MCP server is registered in `.mcp.json` (and at the workspace root). After you
**restart Claude Code**, it can pull official shadcn components/blocks on request
(e.g. "add the shadcn pricing block").

## Deploy
Push to GitHub and import on **Vercel** (zero config), or run `npm run build` and host the
output anywhere that runs Next.js.
