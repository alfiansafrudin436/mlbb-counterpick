import { getLoadout } from '@/lib/loadout'
import { ALL_ROLES } from '@/lib/roles'
import type { Hero, Recommendation, RoleFilter } from '@/types'

export const MAX_RECOMMENDATIONS = 15

const matchesRole = (hero: Hero, role: RoleFilter) => {
  return role === ALL_ROLES || hero.roles.includes(role)
}

export const filterHeroes = (heroes: Hero[], search: string, role: RoleFilter) => {
  const query = search.trim().toLowerCase()
  return heroes
    .filter((hero) => hero.name.toLowerCase().includes(query) && matchesRole(hero, role))
    .sort((a, b) => a.name.localeCompare(b.name))
}

// Skor: +2 untuk tiap musuh yang di-counter, −1 untuk tiap musuh yang meng-counter balik.
export const getRecommendations = (
  heroes: Hero[],
  enemies: Hero[],
  role: RoleFilter,
): Recommendation[] => {
  const enemyNames = new Set(enemies.map((enemy) => enemy.name))

  return (
    heroes
      .filter((hero) => !enemyNames.has(hero.name) && matchesRole(hero, role))
      .map((hero) => {
        const counters = enemies.filter((enemy) => enemy.counteredBy.includes(hero.name))
        const threats = enemies.filter((enemy) => hero.counteredBy.includes(enemy.name))
        return { hero, counters, threats, score: counters.length * 2 - threats.length }
      })
      .filter((item) => item.counters.length > 0)
      .sort(
        (a, b) =>
          b.score - a.score ||
          b.counters.length - a.counters.length ||
          a.hero.name.localeCompare(b.hero.name),
      )
      .slice(0, MAX_RECOMMENDATIONS)
      // Loadout hanya dihitung untuk hero yang benar-benar ditampilkan.
      .map((item) => ({ ...item, loadout: getLoadout(item.hero, enemies) }))
  )
}
