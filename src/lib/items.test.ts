import { describe, expect, it } from 'vitest'
import type { Hero, Role, Trait } from '@/types'
import { loadItemCatalog } from './content-loader'
import { createItemNormalizer, getItemNames } from './items'
import { getLoadout } from './loadout'

const CATALOG = {
  updatedAt: '2026-01-01',
  source: 'https://example.test',
  categories: {
    Attack: ["Haas's Claws", 'Sea Halberd'],
    Movement: ['Warrior Boots', 'Rapid Boots', 'Tough Boots'],
  },
  aliases: { "Haas' Claws": "Haas's Claws" },
}

describe('createItemNormalizer', () => {
  const normalize = createItemNormalizer(CATALOG)

  it('membiarkan nama yang sudah sesuai katalog', () => {
    expect(normalize('Sea Halberd')).toBe('Sea Halberd')
  })

  it('melepas blessing roam dan retribution dari nama sepatu', () => {
    expect(normalize('Tough Boots - Encourage')).toBe('Tough Boots')
    expect(normalize('Rapid Boots- Conceal')).toBe('Rapid Boots')
    expect(normalize("Flame Hunter's Warrior Boots")).toBe('Warrior Boots')
  })

  it('memetakan nama lama lewat alias', () => {
    expect(normalize("Haas' Claws")).toBe("Haas's Claws")
  })

  it('membuang item yang sudah tidak ada', () => {
    expect(normalize('Bloodlust Axe')).toBeUndefined()
  })
})

describe('katalog item asli', () => {
  it('valid dan tanpa nama ganda', async () => {
    const catalog = await loadItemCatalog()
    const all = Object.values(catalog.categories).flat()
    expect(all.length).toBeGreaterThan(90)
    expect(new Set(all).size).toBe(all.length)
  })

  it('setiap alias menunjuk item yang ada', async () => {
    const catalog = await loadItemCatalog()
    const known = getItemNames(catalog)
    for (const [from, to] of Object.entries(catalog.aliases ?? {})) {
      expect(known.has(to), `${from} → ${to}`).toBe(true)
    }
  })

  // Menjaga agar aturan build tidak menyarankan item yang sudah dihapus dari game.
  it('memuat semua item yang bisa disarankan aturan build', async () => {
    const known = getItemNames(await loadItemCatalog())
    const roles: Role[] = ['Tank', 'Fighter', 'Assassin', 'Mage', 'Marksman', 'Support']
    const make = (name: string, role: Role, traits: Trait[]): Hero => ({
      name,
      roles: [role],
      traits,
      counteredBy: [],
      build: [],
    })
    const enemyTeams = [
      [
        make('Heal', 'Fighter', ['heal', 'physical']),
        make('T1', 'Tank', ['cc', 'tank', 'physical']),
        make('T2', 'Tank', ['cc', 'tank', 'magic']),
        make('M1', 'Mage', ['burst', 'magic']),
        make('M2', 'Mage', ['burst', 'magic']),
      ],
      [
        make('A1', 'Assassin', ['burst', 'physical']),
        make('A2', 'Assassin', ['burst', 'physical']),
        make('F1', 'Fighter', ['physical']),
        make('MM', 'Marksman', ['physical']),
        make('M3', 'Mage', ['magic']),
      ],
    ]
    const suggested = new Set<string>()
    for (const role of roles) {
      for (const damage of ['magic', 'physical'] as const) {
        for (const enemies of enemyTeams) {
          for (const adjustment of getLoadout(make('Saya', role, [damage]), enemies).adjustments) {
            suggested.add(adjustment.item)
          }
        }
      }
    }
    expect(suggested.size).toBeGreaterThan(5)
    for (const item of suggested) {
      expect(known.has(item), item).toBe(true)
    }
  })
})
