import type { NextConfig } from "next";
import { getBlogAliasRedirects } from "./lib/blog-aliases.mjs";

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: '/admin/:path*', headers: [
      { key: 'Cache-Control', value: 'private, no-store, max-age=0' },
      { key: 'X-Robots-Tag', value: 'noindex, nofollow, noarchive' },
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'Referrer-Policy', value: 'same-origin' },
      { key: 'X-Content-Type-Options', value: 'nosniff' },
    ] }];
  },
  async redirects() {
    return [
      ...getBlogAliasRedirects(),
      { source: "/blogs/:path*", destination: "/blog/:path*", permanent: true },
      { source: "/de/blogs/:path*", destination: "/de/blog/:path*", permanent: true },
    ];
  },
  images: {
    // Tarayıcı destekliyorsa AVIF, değilse WebP; orijinal JPEG'ler yalnız kaynak.
    formats: ["image/avif", "image/webp"],
    qualities: [75],
  },
};

export default nextConfig;
