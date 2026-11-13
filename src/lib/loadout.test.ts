import { describe, expect, it } from 'vitest'
import type { Hero, Role, Trait } from '@/types'
import { getLoadout, MAX_ADJUSTMENTS } from './loadout'

const hero = (name: string, role: Role, traits: Trait[], build: string[] = []): Hero => ({
  name,
  roles: [role],
  traits,
  counteredBy: [],
  build: build.map((item) => ({ name: item })),
})

const HEALER = hero('Penyembuh', 'Support', ['heal', 'magic'])
const REGEN = hero('Regen', 'Fighter', ['heal', 'physical'])
const STUNNER = hero('Pengunci', 'Tank', ['cc', 'tank', 'physical'])
const WALL = hero('Tembok', 'Tank', ['cc', 'tank', 'magic'])
const NUKER = hero('Peledak', 'Mage', ['burst', 'magic'])
const KILLER = hero('Pembunuh', 'Assassin', ['burst', 'physical'])
const SHOOTER = hero('Penembak', 'Marksman', ['physical'])

const items = (pick: Hero, enemies: Hero[]) =>
  getLoadout(pick, enemies).adjustments.map((adjustment) => adjustment.item)

describe('getLoadout', () => {
  it('tanpa musuh hanya memberi build, emblem, dan spell bawaan', () => {
    const loadout = getLoadout(hero('Saya', 'Mage', ['magic'], ['Genius Wand']), [])
    expect(loadout.build).toEqual([{ name: 'Genius Wand' }])
    expect(loadout.adjustments).toEqual([])
    expect(loadout.emblem).toBe('Mage Emblem')
    expect(loadout.spell).toMatchObject({ name: 'Flicker', reason: 'reasonRoleDefault' })
  })

  it('memilih item anti-heal sesuai jenis hero', () => {
    expect(items(hero('T', 'Tank', ['tank', 'physical']), [HEALER])).toContain('Dominance Ice')
    // Belum ada item anti-heal sihir yang terverifikasi di katalog sekarang.
    expect(items(hero('M', 'Mage', ['magic']), [HEALER])).toEqual([])
    expect(items(hero('F', 'Fighter', ['physical']), [HEALER])).toContain('Sea Halberd')
  })

  it('menyebut musuh yang memicu saran', () => {
    const [antiHeal] = getLoadout(hero('F', 'Fighter', ['physical']), [
      HEALER,
      REGEN,
      SHOOTER,
    ]).adjustments
    expect(antiHeal).toMatchObject({ reason: 'reasonAntiHeal', enemies: ['Penyembuh', 'Regen'] })
  })

  it('menyarankan penembus tank bila musuh punya dua tank', () => {
    expect(items(hero('MM', 'Marksman', ['physical']), [STUNNER, WALL])).toContain(
      'Demon Hunter Sword',
    )
    expect(items(hero('A', 'Assassin', ['burst', 'physical']), [STUNNER, WALL])).toContain(
      'Malefic Roar',
    )
    expect(items(hero('M', 'Mage', ['magic']), [STUNNER, WALL])).toContain('Divine Glaive')
    expect(items(hero('T', 'Tank', ['tank', 'physical']), [STUNNER, WALL])).not.toContain(
      'Malefic Roar',
    )
  })

  it('satu tank saja belum memicu penembus tank', () => {
    expect(items(hero('MM', 'Marksman', ['physical']), [STUNNER])).not.toContain(
      'Demon Hunter Sword',
    )
  })

  it('menyarankan pertahanan sihir saat musuh punya dua pemberi damage sihir', () => {
    const mages = [NUKER, hero('Penyihir', 'Mage', ['magic'])]
    expect(items(hero('T', 'Tank', ['tank', 'physical']), mages)).toContain('Radiant Armor')
    expect(items(hero('MM', 'Marksman', ['physical']), mages)).toContain('Rose Gold Meteor')
  })

  it('tidak mengulang item yang sudah ada di build bawaan', () => {
    const pick = hero('F', 'Fighter', ['physical'], ['Sea Halberd'])
    expect(items(pick, [HEALER])).not.toContain('Sea Halberd')
  })

  it('tidak menghitung Tank dan Support sebagai sumber damage', () => {
    // Penyembuh (Support, magic) + Tembok (Tank, magic) bukan alasan membeli pertahanan sihir.
    expect(items(hero('F', 'Fighter', ['physical']), [HEALER, WALL])).not.toContain('Radiant Armor')
    expect(
      items(hero('F', 'Fighter', ['physical']), [NUKER, hero('N2', 'Mage', ['magic'])]),
    ).toContain('Radiant Armor')
  })

  it('menganggap varian sepatu sebagai item yang sama', () => {
    const pick = hero('T', 'Tank', ['tank', 'physical'], ['Tough Boots - Encourage'])
    expect(items(pick, [STUNNER, WALL])).not.toContain('Tough Boots')
  })

  it('membatasi jumlah saran', () => {
    const pick = hero('F', 'Fighter', ['physical'])
    const enemies = [HEALER, STUNNER, WALL, NUKER, SHOOTER]
    expect(getLoadout(pick, enemies).adjustments.length).toBeLessThanOrEqual(MAX_ADJUSTMENTS)
  })

  it('memilih Purify untuk hero belakang yang menghadapi banyak CC', () => {
    const { spell } = getLoadout(hero('MM', 'Marksman', ['physical']), [STUNNER, WALL])
    expect(spell).toMatchObject({ name: 'Purify', enemies: ['Pengunci', 'Tembok'] })
  })

  it('memilih Aegis saat banyak burst dan Vengeance untuk frontliner lawan fisik', () => {
    expect(getLoadout(hero('M', 'Mage', ['magic']), [NUKER, KILLER]).spell.name).toBe('Aegis')
    expect(
      getLoadout(hero('T', 'Tank', ['tank', 'physical']), [KILLER, SHOOTER, REGEN]).spell.name,
    ).toBe('Vengeance')
  })

  it('Assassin tetap memakai Retribution', () => {
    expect(
      getLoadout(hero('A', 'Assassin', ['burst', 'physical']), [STUNNER, WALL]).spell.name,
    ).toBe('Retribution')
  })
})
