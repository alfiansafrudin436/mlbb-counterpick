import { describe, expect, it } from 'vitest'
import { loadApiHeroes } from './content-loader'
import { parseApiSnapshot, toImageUrl } from './hero-api'

describe('toImageUrl', () => {
  it('melengkapi protokol dan membuang query', () => {
    expect(toImageUrl('//akmweb.youngjoygame.com/web/a.png?w=200-200-fff')).toBe(
      'https://akmweb.youngjoygame.com/web/a.png',
    )
  })

  it('menolak host yang tidak diizinkan dan nilai kosong', () => {
    expect(toImageUrl('https://contoh.test/a.png')).toBeUndefined()
    expect(toImageUrl(null)).toBeUndefined()
  })
})

describe('parseApiSnapshot', () => {
  const snapshot = {
    fetchedAt: '2026-01-01',
    source: 'test',
    heroes: [
      {
        name: 'Alfa',
        key: '//akmweb.youngjoygame.com/web/alfa.png?w=1',
        detail: {
          type: 'Assassin',
          counters: { counters: { name: 'Beta' }, countered: { name: null } },
          gear: {
            out_pack: [
              { equip: { name: 'Pedang', icon: 'https://akmweb.youngjoygame.com/p.png' } },
              { equip: { name: 'Pedang', icon: null } },
              { equip: { name: null, icon: null } },
            ],
          },
        },
      },
      { name: 'Beta', key: null, detail: null },
    ],
  }

  it('memetakan role, relasi counter, dan build tanpa duplikat', () => {
    const [alfa] = parseApiSnapshot(snapshot)
    expect(alfa).toEqual({
      name: 'Alfa',
      image: 'https://akmweb.youngjoygame.com/web/alfa.png',
      role: 'Assassin',
      counters: 'Beta',
      counteredBy: undefined,
      build: [{ name: 'Pedang', icon: 'https://akmweb.youngjoygame.com/p.png' }],
    })
  })

  it('menoleransi hero tanpa detail', () => {
    expect(parseApiSnapshot(snapshot)[1]).toMatchObject({
      name: 'Beta',
      role: undefined,
      build: [],
    })
  })
})

describe('salinan data API asli', () => {
  it('valid dan berisi roster lengkap', async () => {
    const heroes = await loadApiHeroes()
    expect(heroes.length).toBeGreaterThan(120)
    expect(heroes.every((hero) => hero.role && hero.image)).toBe(true)
    expect(heroes.filter((hero) => hero.build?.length === 6).length).toBeGreaterThan(100)
  })

  it('mengembalikan daftar kosong bila file salinan tidak ada', async () => {
    expect(await loadApiHeroes('folder-yang-tidak-ada')).toEqual([])
  })
})
