import 'server-only'
import { cacheLife } from 'next/cache'
import { loadCuratedHeroes } from '@/lib/content-loader'
import { fetchApiHeroes } from '@/lib/hero-api'
import { mergeHeroes } from '@/lib/heroes'
import type { Hero, Locale } from '@/types'

// Sumber data di-cache sekali untuk semua bahasa (API tidak dipanggil ulang per bahasa).
// Hasil normal di-cache sehari; bila API gagal, hanya di-cache sebentar agar segera dicoba lagi.
const loadSources = async () => {
  'use cache'
  const [curated, api] = await Promise.all([loadCuratedHeroes(), fetchApiHeroes()])
  if (api.length) {
    cacheLife('days')
  } else {
    cacheLife('minutes')
  }
  return { curated, api }
}

// Roster dari API digabung dengan data kurasi, dengan teks dalam bahasa `locale`.
export const getHeroes = async (locale: Locale): Promise<Hero[]> => {
  const { curated, api } = await loadSources()
  return mergeHeroes(curated, api, locale)
}
