import type { ItemCatalog } from '@/types'

// Sepatu di API lama ditulis bersama blessing-nya: "Tough Boots - Encourage", "Rapid Boots- Conceal".
const ROAM_SUFFIX = /\s*-\s*(Conceal|Dire Hit|Encourage|Favor)$/
// …atau bersama retribution-nya: "Flame Hunter's Warrior Boots".
const JUNGLE_PREFIX = /^(Flame|Ice|Bloody) Hunter's /

export type ItemNormalizer = (rawName: string) => string | undefined

export const getItemNames = (catalog: ItemCatalog) => {
  return new Set(Object.values(catalog.categories).flat())
}

// Membuat fungsi yang memetakan nama item lama ke nama di katalog sekarang.
// Mengembalikan undefined bila item itu sudah tidak ada di game.
export const createItemNormalizer = (catalog: ItemCatalog): ItemNormalizer => {
  const known = getItemNames(catalog)
  return (rawName) => {
    const base = rawName.trim().replace(ROAM_SUFFIX, '').replace(JUNGLE_PREFIX, '')
    const name = catalog.aliases?.[base] ?? base
    return known.has(name) ? name : undefined
  }
}
