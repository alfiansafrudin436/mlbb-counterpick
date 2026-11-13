import { roleSchema } from '@/lib/content-schema'
import { HERO_IMAGE_HOSTS } from '@/lib/image-hosts'
import type { ApiHero, ApiSnapshot, BuildItem } from '@/types'

// Mengubah salinan data API (content/api-heroes.json) menjadi bentuk yang dipakai aplikasi.
// Situs tidak memanggil API Mobile Legends saat berjalan; salinannya dibuat manual lewat
// `pnpm sync:heroes` (scripts/sync-heroes.mjs).

// "//host/path.png?w=…" → "https://host/path.png"; host yang tidak dikenal diabaikan.
export const toImageUrl = (key: string | null | undefined) => {
  if (!key) return undefined
  try {
    const url = new URL(key.startsWith('//') ? `https:${key}` : key)
    if (url.protocol !== 'https:' || !HERO_IMAGE_HOSTS.includes(url.hostname)) return undefined
    return `${url.origin}${url.pathname}`
  } catch {
    return undefined
  }
}

export const parseApiSnapshot = (snapshot: ApiSnapshot): ApiHero[] => {
  return snapshot.heroes.map(({ name, key, detail }) => {
    const role = roleSchema.safeParse(detail?.type)
    const build: BuildItem[] = []
    for (const item of detail?.gear?.out_pack ?? []) {
      const itemName = item?.equip?.name?.trim()
      if (itemName && !build.some((existing) => existing.name === itemName)) {
        build.push({ name: itemName, icon: toImageUrl(item?.equip?.icon) })
      }
    }
    return {
      name,
      image: toImageUrl(key),
      role: role.success ? role.data : undefined,
      counters: detail?.counters?.counters?.name || undefined,
      counteredBy: detail?.counters?.countered?.name || undefined,
      build,
    }
  })
}
