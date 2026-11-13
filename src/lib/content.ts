import 'server-only'
import { cacheLife } from 'next/cache'
import { loadCuratedHeroes } from '@/lib/content-loader'
import { fetchApiHeroes } from '@/lib/hero-api'
import { mergeHeroes } from '@/lib/heroes'
import type { Hero } from '@/types'

// Roster dari API digabung dengan data kurasi. Hasilnya di-cache sehari;
// bila API gagal, hasil cadangan (kurasi saja) hanya di-cache sebentar agar segera dicoba lagi.
export const getHeroes = async (): Promise<Hero[]> => {
  'use cache'
  const [curated, api] = await Promise.all([loadCuratedHeroes(), fetchApiHeroes()])
  if (api.length) {
    cacheLife('days')
  } else {
    cacheLife('minutes')
  }
  return mergeHeroes(curated, api)
}
