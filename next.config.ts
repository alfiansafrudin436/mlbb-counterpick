import type { NextConfig } from 'next'
import { HERO_IMAGE_HOSTS } from './src/lib/hero-images'

const nextConfig: NextConfig = {
  cacheComponents: true,
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
