import { describe, expect, it } from 'vitest'
import type { ApiHero, CuratedHero } from '@/types'
import { mergeHeroes } from './heroes'

const CURATED: CuratedHero[] = [
  { name: 'Alfa', roles: ['Assassin'], weakness: 'Tipis', counteredBy: ['Tameng'] },
  { name: 'Tameng', roles: ['Tank', 'Support'], weakness: 'Lambat', counteredBy: ['Alfa'] },
  { name: 'Lama', roles: ['Mage'], weakness: 'Tanpa escape', counteredBy: ['Alfa'] },
]

const API: ApiHero[] = [
  { name: 'Alfa', image: 'https://cdn.test/alfa.png', role: 'Assassin', counteredBy: 'Baru' },
  { name: 'Tameng', role: 'Tank', counters: 'Baru', counteredBy: 'Tidak Ada' },
  { name: 'Baru', image: 'https://cdn.test/baru.png', role: 'Marksman', counters: 'Baru' },
  { name: 'Tanpa Role' },
]

const find = (name: string) => mergeHeroes(CURATED, API).find((hero) => hero.name === name)

describe('mergeHeroes', () => {
  it('mengambil gambar dari API dan kelemahan dari kurasi', () => {
    expect(find('Alfa')).toMatchObject({ image: 'https://cdn.test/alfa.png', weakness: 'Tipis' })
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

  it('membuang hero tanpa role', () => {
    expect(find('Tanpa Role')).toBeUndefined()
  })

  it('berjalan hanya dengan data kurasi bila API kosong', () => {
    const heroes = mergeHeroes(CURATED, [])
    expect(heroes.map((hero) => hero.name)).toEqual(['Alfa', 'Tameng', 'Lama'])
    expect(heroes.every((hero) => hero.image === undefined)).toBe(true)
  })
})
