import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

// Content Security Policy.
// - Server-side fetches (Behold / Instagram Graph) don't need connect-src.
// - Instagram/Behold image CDNs are allow-listed for the live feed.
// - The contact map is an OpenStreetMap iframe → frame-src.
// - Dev needs 'unsafe-eval' (Turbopack) and ws: (HMR); production does not.
const csp = [
  `default-src 'self'`,
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  `style-src 'self' 'unsafe-inline'`,
  `img-src 'self' data: blob: https://*.cdninstagram.com https://*.fbcdn.net https://*.behold.so https://picsum.photos https://*.picsum.photos`,
  `font-src 'self' data:`,
  `connect-src 'self'${isDev ? " ws:" : ""}`,
  `frame-src https://www.openstreetmap.org`,
  `frame-ancestors 'none'`,
  `base-uri 'self'`,
  `form-action 'self'`,
  `object-src 'none'`,
  `upgrade-insecure-requests`,
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
];

const nextConfig: NextConfig = {
  // Don't leak the framework version in the Server / X-Powered-By header.
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
