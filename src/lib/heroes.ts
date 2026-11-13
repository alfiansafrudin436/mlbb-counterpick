import { resolveTraits } from '@/lib/traits'
import type { ApiHero, CuratedHero, Hero, Locale, Role } from '@/types'

export const MAX_ENEMIES = 5

// Menggabungkan roster dari API dengan data counter hasil kurasi.
// - Nama, gambar, dan role utama: API. Role kurasi ditambahkan sebagai role sekunder/cadangan.
// - Counter: kurasi lebih dulu, lalu relasi counter dari API.
// - Hero yang hanya ada di salah satu sumber tetap ditampilkan selama punya role.
// - Teks kelemahan diambil sesuai `locale`.
export const mergeHeroes = (curated: CuratedHero[], api: ApiHero[], locale: Locale): Hero[] => {
  const curatedByName = new Map(curated.map((hero) => [hero.name, hero]))
  const apiByName = new Map(api.map((hero) => [hero.name, hero]))

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
    build: apiByName.get(name)?.build ?? [],
  }))
}

// Katalog ikon item (nama → URL), dikumpulkan dari semua build di API.
// Dipakai untuk menampilkan ikon item situasional yang tidak ada di build hero itu sendiri.
export const buildItemIcons = (api: ApiHero[]): Record<string, string> => {
  const icons: Record<string, string> = {}
  for (const hero of api) {
    for (const item of hero.build ?? []) {
      if (item.icon && !icons[item.name]) icons[item.name] = item.icon
    }
  }
  return icons
}
