import { apiHeroDetailSchema, apiHeroListSchema, roleSchema } from '@/lib/content-schema'
import { HERO_IMAGE_HOSTS } from '@/lib/image-hosts'
import type { ApiHero } from '@/types'

// Klien API Mobile Legends (tidak terdokumentasi): daftar hero + detail per hero.
// Semua kegagalan ditoleransi — pemanggil tetap bisa jalan hanya dengan data kurasi.

const API_BASE = 'https://mapi.mobilelegends.com'
const TIMEOUT_MS = 10_000

const fetchJson = async (path: string): Promise<unknown> => {
  const response = await fetch(`${API_BASE}${path}`, { signal: AbortSignal.timeout(TIMEOUT_MS) })
  if (!response.ok) throw new Error(`HTTP ${response.status}`)
  return response.json()
}

// "//host/path.png?w=…" → "https://host/path.png"; host yang tidak dikenal diabaikan.
export const toImageUrl = (key: string | undefined) => {
  if (!key) return undefined
  try {
    const url = new URL(key.startsWith('//') ? `https:${key}` : key)
    if (url.protocol !== 'https:' || !HERO_IMAGE_HOSTS.includes(url.hostname)) return undefined
    return `${url.origin}${url.pathname}`
  } catch {
    return undefined
  }
}

type HeroDetail = Pick<ApiHero, 'role' | 'counters' | 'counteredBy'>

const fetchHeroDetail = async (heroId: string): Promise<HeroDetail> => {
  const raw = await fetchJson(`/hero/detail?id=${encodeURIComponent(heroId)}&language=en`)
  const { data } = apiHeroDetailSchema.parse(raw)
  const role = roleSchema.safeParse(data.type)
  return {
    role: role.success ? role.data : undefined,
    counters: data.counters?.counters?.name || undefined,
    counteredBy: data.counters?.countered?.name || undefined,
  }
}

// Mengembalikan daftar kosong bila API tidak bisa dihubungi.
export const fetchApiHeroes = async (): Promise<ApiHero[]> => {
  try {
    const list = apiHeroListSchema.parse(await fetchJson('/hero/list?language=en'))
    const details = await Promise.allSettled(list.data.map((item) => fetchHeroDetail(item.heroid)))
    const failed = details.filter((detail) => detail.status === 'rejected')
    if (failed.length) {
      console.warn(
        `[hero-api] ${failed.length}/${details.length} detail hero gagal dimuat:`,
        failed[0].reason,
      )
    }
    return list.data.map((item, index) => {
      const detail = details[index]
      return {
        name: item.name,
        image: toImageUrl(item.key),
        ...(detail.status === 'fulfilled' ? detail.value : {}),
      }
    })
  } catch (error) {
    console.warn('[hero-api] gagal memuat daftar hero, memakai data kurasi saja:', error)
    return []
  }
}
