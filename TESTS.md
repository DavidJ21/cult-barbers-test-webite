# Test Plan — Cult Barber Studio

Two suites, both runnable with **zero extra dependencies** (Node's built-in test
runner + TypeScript stripping).

## How to run

```bash
# Unit tests (fast, no server) — feed parsing + URL sanitisation
npm test

# End-to-end tests — builds, serves, asserts against the live HTML, tears down
bash tests/run-e2e.sh
# (or, against an already-running server:)
TEST_BASE_URL=http://localhost:3000 npm run test:e2e
```

## Latest result: ✅ 23 / 23 passing (10 unit + 13 e2e), lint clean, build clean

---

## Unit tests — `tests/unit/instagram-normalize.test.ts`

Covers the security-critical feed normalisation in `src/lib/instagram-normalize.ts`.

| # | Test case | Expected |
|---|-----------|----------|
| U1 | `safeHttpsUrl` accepts https URLs | returns the URL |
| U2 | `safeHttpsUrl` rejects http, `javascript:`, `data:`, garbage, empty, non-string | returns `null` |
| U3 | Behold: array form parsed, prefers `medium` image size | post mapped correctly |
| U4 | Behold: `{ posts: [] }` wrapper form parsed | 1 post |
| U5 | Behold: posts with http/missing images dropped | only valid https kept |
| U6 | Behold: `javascript:` permalink sanitised | falls back to profile URL |
| U7 | Behold: respects the 8-post limit | 8 of 20 |
| U8 | Behold: empty / null / `{}` input | `[]` |
| U9 | Graph: maps images, uses `thumbnail_url` for video | correct image + `isVideo` |
| U10 | Graph: drops invalid image, sanitises permalink | 1 post, fallback permalink |

## End-to-end tests — `tests/e2e/site.test.ts`

Runs against the production server (gallery in fallback/placeholder state).

| # | Test case | Expected |
|---|-----------|----------|
| E1 | `GET /` | HTTP 200 |
| E2 | Page `<title>` | contains "Cult Barber Studio" |
| E3 | All 12 services + prices render | every name and `$price` present |
| E4 | All 3 barbers render | name + role present |
| E5 | Square booking link | appears on ≥3 CTAs |
| E6 | Instagram profile link | present |
| E7 | Contact details | suburb, `tel:` link, email present |
| E8 | Location map | OpenStreetMap embed iframe present |
| E9 | Instagram fallback | placeholder grid shown when unconfigured |
| E10 | **Reverse tabnabbing** | every `target="_blank"` has `rel=noopener` |
| E11 | **Security headers** | CSP, HSTS, `nosniff`, `X-Frame-Options: DENY`, Referrer-Policy, Permissions-Policy present; `X-Powered-By` absent |
| E12 | **CSP allow-list** | permits Instagram CDN + OpenStreetMap frame |
| E13 | Unknown route | HTTP 404 |

## Notes / coverage gaps (manually verified, not automated)
- **Live Instagram render path** — verified manually end-to-end (sample feed → 8 real
  `<img>` posts rendered into the grid). Automating it would require a mock feed host;
  the parsing half is fully covered by unit tests U3–U10, and the wiring by E9's fallback.
- **Responsive layout / mobile nav (Sheet)** — verified visually in the browser preview.
- **Visual styling** — verified via screenshots; not asserted programmatically.
