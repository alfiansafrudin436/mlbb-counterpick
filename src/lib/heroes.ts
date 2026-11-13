import type { ApiHero, CuratedHero, Hero, Role } from '@/types'

export const MAX_ENEMIES = 5

// Menggabungkan roster dari API dengan data counter hasil kurasi.
// - Nama, gambar, dan role utama: API. Role kurasi ditambahkan sebagai role sekunder/cadangan.
// - Counter: kurasi lebih dulu, lalu relasi counter dari API.
// - Hero yang hanya ada di salah satu sumber tetap ditampilkan selama punya role.
export const mergeHeroes = (curated: CuratedHero[], api: ApiHero[]): Hero[] => {
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
    weakness: curatedByName.get(name)?.weakness,
    counteredBy: [...(counteredBy.get(name) ?? [])],
    image: apiByName.get(name)?.image,
  }))
}
