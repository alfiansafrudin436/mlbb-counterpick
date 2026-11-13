import { describe, expect, it } from 'vitest'
import { HERO_IMAGE_HOSTS, HERO_IMAGES } from './hero-images'
import { getHero, HEROES } from './heroes'
import { ROLES } from './roles'

describe('data hero', () => {
  it('tidak punya nama ganda', () => {
    const names = HEROES.map((hero) => hero.name)
    expect(new Set(names).size).toBe(names.length)
  })

  it('setiap hero punya role yang valid dan kelemahan', () => {
    for (const hero of HEROES) {
      expect(hero.roles.length, hero.name).toBeGreaterThan(0)
      expect(
        hero.roles.every((role) => ROLES.includes(role)),
        hero.name,
      ).toBe(true)
      expect(hero.weakness.trim(), hero.name).not.toBe('')
    }
  })

  it('setiap counter merujuk hero lain yang ada di data', () => {
    for (const hero of HEROES) {
      expect(hero.counteredBy.length, hero.name).toBeGreaterThan(0)
      for (const counter of hero.counteredBy) {
        expect(getHero(counter), `${hero.name} → ${counter}`).toBeDefined()
        expect(counter, hero.name).not.toBe(hero.name)
      }
    }
  })

  it('setiap gambar merujuk hero yang ada dan host yang diizinkan', () => {
    for (const [name, url] of Object.entries(HERO_IMAGES)) {
      expect(getHero(name), name).toBeDefined()
      expect(HERO_IMAGE_HOSTS, name).toContain(new URL(url).hostname)
    }
  })
})
