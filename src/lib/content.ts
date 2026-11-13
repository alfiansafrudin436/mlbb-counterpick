import 'server-only'
import { cacheLife } from 'next/cache'
import { loadCuratedHeroes, loadItemCatalog } from '@/lib/content-loader'
import { fetchApiHeroes } from '@/lib/hero-api'
import { buildItemIcons, mergeHeroes } from '@/lib/heroes'
import { createItemNormalizer } from '@/lib/items'
import type { Hero, Locale } from '@/types'

// Sumber data di-cache sekali untuk semua bahasa (API tidak dipanggil ulang per bahasa).
// Hasil normal di-cache sehari; bila API gagal, hanya di-cache sebentar agar segera dicoba lagi.
const loadSources = async () => {
  'use cache'
  const [curated, items, api] = await Promise.all([
    loadCuratedHeroes(),
    loadItemCatalog(),
    fetchApiHeroes(),
  ])
  if (api.length) {
    cacheLife('days')
  } else {
    cacheLife('minutes')
  }
  return { curated, items, api }
}

// Roster dari API digabung dengan data kurasi (teks dalam bahasa `locale`), plus katalog ikon item.
export const getHeroData = async (
  locale: Locale,
): Promise<{ heroes: Hero[]; itemIcons: Record<string, string> }> => {
  const { curated, items, api } = await loadSources()
  // Build dari API disaring terhadap katalog item sekarang (content/items.yaml).
  const normalize = createItemNormalizer(items)
  return {
    heroes: mergeHeroes(curated, api, locale, normalize),
    itemIcons: buildItemIcons(api, normalize),
  }
}
