import type { NextConfig } from 'next'
import { HERO_IMAGE_HOSTS } from './src/lib/image-hosts'

const nextConfig: NextConfig = {
  cacheComponents: true,
  // Konten dibaca dari folder `content/` lewat fs; pastikan ikut ter-trace saat deploy.
  outputFileTracingIncludes: {
    '/**': ['./content/**/*'],
  },
  images: {
    remotePatterns: HERO_IMAGE_HOSTS.map((hostname) => ({ protocol: 'https' as const, hostname })),
  },
  turbopack: {
    rules: {
      '*.css': {
        loaders: ['@tailwindcss/turbopack'],
        as: '*.css',
      },
    },
  },
}

export default nextConfig
