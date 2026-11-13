import type { ItemNormalizer } from '@/lib/items'
import { resolveTraits } from '@/lib/traits'
import type { ApiHero, BuildItem, CuratedHero, Hero, Locale, Role } from '@/types'

export const MAX_ENEMIES = 5

const keepName: ItemNormalizer = (name) => name

// Katalog ikon item (nama sekarang → URL), dikumpulkan dari semua build di API.
// Ikon dari item yang namanya persis sama diutamakan daripada ikon varian (mis. sepatu + blessing).
export const buildItemIcons = (
  api: ApiHero[],
  normalize: ItemNormalizer = keepName,
): Record<string, string> => {
  const icons: Record<string, string> = {}
  const exact = new Set<string>()
  for (const hero of api) {
    for (const item of hero.build ?? []) {
      const name = normalize(item.name)
      if (!name || !item.icon) continue
      if (name === item.name && !exact.has(name)) {
        icons[name] = item.icon
        exact.add(name)
      } else if (!icons[name]) {
        icons[name] = item.icon
      }
    }
  }
  return icons
}

// Build dari API disesuaikan dengan katalog item sekarang: nama lama dipetakan,
// item yang sudah dihapus dibuang, dan duplikat hasil pemetaan digabung.
const normalizeBuild = (
  build: BuildItem[],
  normalize: ItemNormalizer,
  icons: Record<string, string>,
): BuildItem[] => {
  const items: BuildItem[] = []
  for (const item of build) {
    const name = normalize(item.name)
    if (!name || items.some((existing) => existing.name === name)) continue
    items.push({ name, icon: icons[name] ?? item.icon })
  }
  return items
}

// Menggabungkan roster dari API dengan data counter hasil kurasi.
// - Nama, gambar, dan role utama: API. Role kurasi ditambahkan sebagai role sekunder/cadangan.
// - Counter: kurasi lebih dulu, lalu relasi counter dari API.
// - Hero yang hanya ada di salah satu sumber tetap ditampilkan selama punya role.
// - Teks kelemahan diambil sesuai `locale`.
// - Build disaring lewat `normalize` (lihat src/lib/items.ts); tanpa itu nama item dipakai apa adanya.
export const mergeHeroes = (
  curated: CuratedHero[],
  api: ApiHero[],
  locale: Locale,
  normalize: ItemNormalizer = keepName,
): Hero[] => {
  const curatedByName = new Map(curated.map((hero) => [hero.name, hero]))
  const apiByName = new Map(api.map((hero) => [hero.name, hero]))
  const icons = buildItemIcons(api, normalize)

  const roles = new Map<string, Role[]>()
  for (const name of new Set([...apiByName.keys(), ...curatedByName.keys()])) {
    const apiRole = apiByName.get(name)?.role
    const merged = [...(apiRole ? [apiRole] : []), ...(curatedByName.get(name)?.roles ?? [])]
    if (merged.length) roles.set(name, [...new Set(merged)])
  }

  const counteredBy = new Map<string, Set<string>>(
    [...roles.keys()].map((name) => [name, new Set()]),
  )
  const addCounter = (target: string, counter: string | undefined) => {
    if (!counter || counter === target || !roles.has(counter)) return
    counteredBy.get(target)?.add(counter)
  }
  for (const hero of curated) {
    for (const counter of hero.counteredBy) addCounter(hero.name, counter)
  }
  for (const hero of api) {
    addCounter(hero.name, hero.counteredBy)
    if (hero.counters) addCounter(hero.counters, hero.name)
  }

  return [...roles.entries()].map(([name, heroRoles]) => ({
    name,
    roles: heroRoles,
    traits: resolveTraits(heroRoles, curatedByName.get(name)?.traits),
    weakness: curatedByName.get(name)?.weakness[locale],
    counteredBy: [...(counteredBy.get(name) ?? [])],
    image: apiByName.get(name)?.image,
    build: normalizeBuild(apiByName.get(name)?.build ?? [], normalize, icons),
  }))
}
