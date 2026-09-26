import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Tarayıcı destekliyorsa AVIF, değilse WebP; orijinal JPEG'ler yalnız kaynak.
    formats: ["image/avif", "image/webp"],
    qualities: [75],
  },
};

export default nextConfig;
