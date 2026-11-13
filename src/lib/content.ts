import 'server-only'
import { cacheLife } from 'next/cache'
import { loadApiHeroes, loadCuratedHeroes, loadItemCatalog } from '@/lib/content-loader'
import { buildItemIcons, mergeHeroes } from '@/lib/heroes'
import { createItemNormalizer } from '@/lib/items'
import type { Hero, Locale } from '@/types'

// Semua sumber adalah file di folder `content/` (termasuk salinan data API), jadi hasilnya
// statis: di-cache permanen dan ikut ter-prerender saat build. Tidak ada panggilan jaringan.
const loadSources = async () => {
  'use cache'
  const [curated, items, api] = await Promise.all([
    loadCuratedHeroes(),
    loadItemCatalog(),
    loadApiHeroes(),
  ])
  cacheLife('max')
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
