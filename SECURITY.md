# Security Audit — Cult Barber Studio

Scope: the Next.js app in this folder. Reviewed all source under `src/`, the
config, and dependency/secret handling. Below are the findings and the fixes applied.

## Findings & fixes

| # | Severity | Finding | Status |
|---|----------|---------|--------|
| 1 | Medium | **Unsanitised external URLs from the Instagram feed.** Feed `permalink` values were rendered straight into an anchor `href`, and image URLs into `<img src>`. A compromised/malicious feed could inject a `javascript:` (or other-scheme) URL — an XSS vector via the `href`. | **Fixed** |
| 2 | Medium | **No security response headers** (no CSP, HSTS, anti-clickjacking, etc.). | **Fixed** |
| 3 | Low | **URL building with raw interpolation** for the Behold feed ID and Graph token. | **Fixed** |
| 4 | Low | Framework version leaked via `X-Powered-By`. | **Fixed** |
| 5 | Info | Reverse-tabnabbing: every `target="_blank"` already has `rel="noopener noreferrer"` (13/13). | OK |
| 6 | Info | No `dangerouslySetInnerHTML`, `eval`, or `document.write` in the app. | OK |
| 7 | Info | Secrets (`BEHOLD_FEED_ID`, `INSTAGRAM_TOKEN`) are read **server-side only** from env, never shipped to the client bundle. `.env*` is git-ignored. | OK |
| 8 | Low | The old static site in `../barber-studio-site/` used `innerHTML` (with developer-controlled data). It was **superseded** by this app and has now been **deleted**. | **Resolved** |

## Detail on the fixes

**1 — URL sanitisation (`src/lib/instagram-normalize.ts`).**
All feed URLs now pass through `safeHttpsUrl()`, which parses the value and accepts
it only if the protocol is `https:`. `permalink` falls back to the studio profile URL
if invalid; posts without a valid https image are dropped instead of rendered. This
neutralises `javascript:`/`data:`/scheme-confusion payloads from the feed.

**2 — Security headers (`next.config.ts`).**
Added for every route:
- `Content-Security-Policy` — `default-src 'self'`; image CDNs allow-listed for the
  live feed (`*.cdninstagram.com`, `*.fbcdn.net`, `*.behold.so`, `picsum.photos`);
  `frame-src` limited to OpenStreetMap; `frame-ancestors 'none'`; `object-src 'none'`;
  `base-uri`/`form-action 'self'`; `upgrade-insecure-requests`. (`'unsafe-eval'` and
  `ws:` are added in dev only, for Turbopack/HMR — production CSP omits them.)
- `Strict-Transport-Security`, `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`,
  `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` (camera /
  microphone / geolocation / browsing-topics disabled).

**3 — Safe URL construction (`src/lib/instagram.ts`).**
Behold uses `encodeURIComponent(feedId)`; the Graph request is built with `URL` +
`URLSearchParams` so the token is encoded and cannot break out of the query string.

**4 — `poweredByHeader: false`** in `next.config.ts`.

## Verified
- `npm run build` passes (type-safe, lint-clean).
- Production server emits all six headers; `X-Powered-By` is absent.
- Page renders with **no CSP violations** in the console; the OpenStreetMap map and
  (when configured) the Instagram images load under the policy.
- Covered by the automated suite — see `TESTS.md` (header presence, URL-sanitisation
  unit tests, tabnabbing check).
