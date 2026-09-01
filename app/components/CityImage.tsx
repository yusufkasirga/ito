'use client';

import { useState } from 'react';

/**
 * Şehir görseli — "foto-hazır", çok katmanlı sistem.
 * Sırasıyla dener: (1) `/images/dest/<slug>.jpg` (sahip stok fotoğrafı),
 * (2) `fallback` (varsa küratörlü kapak), (3) accent-degrade zemin.
 * Böylece asla kırık ya da YANLIŞ şehir fotoğrafı çıkmaz; sahip 60 fotoğrafı
 * /public/images/dest/'e slug adıyla ekledikçe otomatik doğru şehirde belirir.
 */
export default function CityImage({
  slug,
  accent,
  alt,
  fallback,
  primary,
  priority = false,
}: {
  slug: string;
  accent: string;
  alt: string;
  fallback?: string;
  primary?: string;
  priority?: boolean;
}) {
  const sources = [primary ?? `/images/dest/${slug}.jpg`, ...(fallback ? [fallback] : [])];
  const [idx, setIdx] = useState(0);
  const src = idx < sources.length ? sources[idx] : null;

  return (
    <span style={{ position: 'absolute', inset: 0, zIndex: 0, overflow: 'hidden' }}>
      <span
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(130% 130% at 20% 15%, ${accent} 0%, #0a1a2b 60%, #071726 100%)`,
        }}
      />
      <span
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(rgba(255,250,241,.05) 1px, transparent 1px)',
          backgroundSize: '18px 18px',
          opacity: 0.5,
        }}
      />
      {src && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
          decoding="async"
          onError={() => setIdx((i) => i + 1)}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        />
      )}
    </span>
  );
}
