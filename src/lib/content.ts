import 'server-only'
import { cacheLife } from 'next/cache'
import { loadCuratedHeroes } from '@/lib/content-loader'
import { fetchApiHeroes } from '@/lib/hero-api'
import { buildItemIcons, mergeHeroes } from '@/lib/heroes'
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

// Roster dari API digabung dengan data kurasi (teks dalam bahasa `locale`), plus katalog ikon item.
export const getHeroData = async (
  locale: Locale,
): Promise<{ heroes: Hero[]; itemIcons: Record<string, string> }> => {
  const { curated, api } = await loadSources()
  return { heroes: mergeHeroes(curated, api, locale), itemIcons: buildItemIcons(api) }
}
