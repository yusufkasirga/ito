import type { NextConfig } from "next";
import { getBlogAliasRedirects } from "./lib/blog-aliases.mjs";

const nextConfig: NextConfig = {
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
