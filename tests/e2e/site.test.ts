import { test, before } from "node:test";
import assert from "node:assert/strict";
import { site, services, team } from "../../src/lib/site.ts";

// Run against a server started without BEHOLD_FEED_ID / INSTAGRAM_TOKEN
// (so the gallery is in its placeholder/fallback state).
const BASE = process.env.TEST_BASE_URL ?? "http://localhost:4139";

let html = "";
let visible = ""; // comment-markers stripped, entities decoded
let headers: Headers;
let status = 0;

before(async () => {
  const res = await fetch(`${BASE}/`);
  status = res.status;
  headers = res.headers;
  html = await res.text();
  // React splits static/dynamic text with <!-- --> markers and HTML-encodes
  // '&'/apostrophes — normalise so plain substring checks work.
  visible = html
    .replace(/<!--.*?-->/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&#x27;|&#39;/g, "'");
});

test("home page returns 200", () => {
  assert.equal(status, 200);
});

test("page title is set correctly", () => {
  assert.match(html, /<title>[^<]*Cult Barber Studio[^<]*<\/title>/);
});

test("all 12 services and their prices render", () => {
  for (const s of services) {
    assert.ok(visible.includes(s.name), `missing service: ${s.name}`);
    assert.ok(visible.includes(`$${s.price}`), `missing price $${s.price}`);
  }
});

test("all 3 barbers render", () => {
  for (const b of team) {
    assert.ok(visible.includes(b.name), `missing barber: ${b.name}`);
    assert.ok(visible.includes(b.role), `missing role: ${b.role}`);
  }
});

test("Square booking link is present (and on multiple CTAs)", () => {
  const count = html.split(site.bookingUrl).length - 1;
  assert.ok(count >= 3, `expected >=3 booking links, found ${count}`);
});

test("Instagram profile link is present", () => {
  assert.ok(html.includes(site.instagram.url));
});

test("contact details render (address, phone, email)", () => {
  assert.ok(html.includes("Tyabb"), "missing suburb");
  assert.ok(html.includes(site.contact.phoneHref), "missing tel link");
  assert.ok(html.includes(site.contact.email), "missing email");
});

test("location map iframe is embedded", () => {
  assert.match(html, /openstreetmap\.org\/export\/embed/);
});

test("Instagram gallery falls back to placeholder when unconfigured", () => {
  assert.ok(html.includes("Placeholder grid"));
});

test("every target=_blank link has rel=noopener (no reverse tabnabbing)", () => {
  const anchors = html.match(/<a\b[^>]*>/g) ?? [];
  const blanks = anchors.filter((a) => /target="_blank"/.test(a));
  assert.ok(blanks.length > 0, "expected external links to exist");
  for (const a of blanks) {
    assert.match(a, /rel="[^"]*noopener/, `link missing rel=noopener: ${a}`);
  }
});

test("security headers are present and X-Powered-By is hidden", () => {
  assert.match(
    headers.get("content-security-policy") ?? "",
    /default-src 'self'/
  );
  assert.ok(headers.get("strict-transport-security"), "missing HSTS");
  assert.equal(headers.get("x-content-type-options"), "nosniff");
  assert.equal(headers.get("x-frame-options"), "DENY");
  assert.ok(headers.get("referrer-policy"), "missing Referrer-Policy");
  assert.ok(headers.get("permissions-policy"), "missing Permissions-Policy");
  assert.equal(headers.get("x-powered-by"), null, "X-Powered-By should be off");
});

test("CSP allows the Instagram CDN and OpenStreetMap frame", () => {
  const csp = headers.get("content-security-policy") ?? "";
  assert.match(csp, /cdninstagram\.com/);
  assert.match(csp, /frame-src https:\/\/www\.openstreetmap\.org/);
});

test("unknown route returns 404", async () => {
  const res = await fetch(`${BASE}/definitely-not-a-real-page`);
  assert.equal(res.status, 404);
});
