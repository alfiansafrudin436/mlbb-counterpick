import { describe, expect, it } from 'vitest'
import type { ApiHero, CuratedHero } from '@/types'
import { buildItemIcons, mergeHeroes } from './heroes'

const CURATED: CuratedHero[] = [
  {
    name: 'Alfa',
    roles: ['Assassin'],
    weakness: { id: 'Tipis', en: 'Squishy' },
    counteredBy: ['Tameng'],
  },
  {
    name: 'Tameng',
    roles: ['Tank', 'Support'],
    weakness: { id: 'Lambat', en: 'Slow' },
    counteredBy: ['Alfa'],
  },
  {
    name: 'Lama',
    roles: ['Mage'],
    weakness: { id: 'Tanpa escape', en: 'No escape' },
    counteredBy: ['Alfa'],
  },
]

const API: ApiHero[] = [
  { name: 'Alfa', image: 'https://cdn.test/alfa.png', role: 'Assassin', counteredBy: 'Baru' },
  { name: 'Tameng', role: 'Tank', counters: 'Baru', counteredBy: 'Tidak Ada' },
  { name: 'Baru', image: 'https://cdn.test/baru.png', role: 'Marksman', counters: 'Baru' },
  { name: 'Tanpa Role' },
]

const find = (name: string) => mergeHeroes(CURATED, API, 'id').find((hero) => hero.name === name)

describe('mergeHeroes', () => {
  it('mengambil gambar dari API dan kelemahan dari kurasi', () => {
    expect(find('Alfa')).toMatchObject({
      image: 'https://cdn.test/alfa.png',
      weakness: 'Tipis',
    })
  })

  it('menaruh role API di depan lalu menambah role kurasi tanpa duplikat', () => {
    expect(find('Tameng')?.roles).toEqual(['Tank', 'Support'])
  })

  it('menggabungkan counter kurasi dengan relasi dari API', () => {
    expect(find('Alfa')?.counteredBy).toEqual(['Tameng', 'Baru'])
    // "Tameng counters Baru" dari API berarti Baru di-counter Tameng.
    expect(find('Baru')?.counteredBy).toEqual(['Tameng'])
  })

  it('mengabaikan counter yang tidak dikenal atau merujuk diri sendiri', () => {
    expect(find('Tameng')?.counteredBy).toEqual(['Alfa'])
  })

  it('tetap menampilkan hero yang hanya ada di satu sumber', () => {
    expect(find('Lama')).toMatchObject({ roles: ['Mage'], image: undefined })
    expect(find('Baru')).toMatchObject({ roles: ['Marksman'], weakness: undefined })
  })

  it('memakai teks kelemahan sesuai bahasa', () => {
    const alfa = mergeHeroes(CURATED, API, 'en').find((hero) => hero.name === 'Alfa')
    expect(alfa?.weakness).toBe('Squishy')
  })

  it('membuang hero tanpa role', () => {
    expect(find('Tanpa Role')).toBeUndefined()
  })

  it('berjalan hanya dengan data kurasi bila API kosong', () => {
    const heroes = mergeHeroes(CURATED, [], 'id')
    expect(heroes.map((hero) => hero.name)).toEqual(['Alfa', 'Tameng', 'Lama'])
    expect(heroes.every((hero) => hero.image === undefined)).toBe(true)
    expect(heroes.every((hero) => hero.build.length === 0)).toBe(true)
  })

  it('menurunkan sifat dari role dan menggabungkannya dengan kurasi', () => {
    const curated: CuratedHero[] = [
      { ...CURATED[1], traits: ['cc'] },
      { ...CURATED[0], counteredBy: ['Tameng'] },
    ]
    const heroes = mergeHeroes(curated, [], 'id')
    expect(heroes.find((hero) => hero.name === 'Tameng')?.traits).toEqual([
      'cc',
      'physical',
      'tank',
    ])
    expect(heroes.find((hero) => hero.name === 'Alfa')?.traits).toEqual(['burst', 'physical'])
  })

  it('membawa build dari API dan mengumpulkan katalog ikon item', () => {
    const api: ApiHero[] = [
      {
        name: 'Alfa',
        role: 'Assassin',
        build: [{ name: 'Pedang', icon: 'https://cdn.test/p.png' }],
      },
      { name: 'Tameng', role: 'Tank', build: [{ name: 'Pedang' }, { name: 'Perisai' }] },
    ]
    const alfa = mergeHeroes(CURATED, api, 'id').find((hero) => hero.name === 'Alfa')
    expect(alfa?.build).toEqual([{ name: 'Pedang', icon: 'https://cdn.test/p.png' }])
    expect(buildItemIcons(api)).toEqual({ Pedang: 'https://cdn.test/p.png' })
  })

  it('menyaring build lewat normalizer: memetakan nama lama dan membuang item yang dihapus', () => {
    const api: ApiHero[] = [
      {
        name: 'Alfa',
        role: 'Assassin',
        build: [
          { name: 'Sepatu - Roam', icon: 'https://cdn.test/roam.png' },
          { name: 'Sepatu', icon: 'https://cdn.test/sepatu.png' },
          { name: 'Usang', icon: 'https://cdn.test/usang.png' },
          { name: 'Pedang' },
        ],
      },
    ]
    const normalize = (name: string) => (name === 'Usang' ? undefined : name.replace(' - Roam', ''))
    const alfa = mergeHeroes(CURATED, api, 'id', normalize).find((hero) => hero.name === 'Alfa')
    // Varian sepatu digabung ke nama dasarnya dan memakai ikon item yang namanya persis sama.
    expect(alfa?.build).toEqual([
      { name: 'Sepatu', icon: 'https://cdn.test/sepatu.png' },
      { name: 'Pedang', icon: undefined },
    ])
    expect(buildItemIcons(api, normalize)).toEqual({ Sepatu: 'https://cdn.test/sepatu.png' })
  })
})
