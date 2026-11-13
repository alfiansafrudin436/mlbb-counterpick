import { describe, expect, it } from 'vitest'
import type { Hero } from '@/types'
import { filterHeroes, getRecommendations } from './helper'

const hero = (name: string, role: Hero['roles'][number], counteredBy: string[]): Hero => ({
  name,
  roles: [role],
  traits: ['physical'],
  weakness: `Kelemahan ${name}`,
  counteredBy,
  build: [],
})

const A = hero('Alfa', 'Assassin', ['Tameng', 'Sihir'])
const B = hero('Busur', 'Marksman', ['Tameng', 'Alfa'])
const TAMENG = hero('Tameng', 'Tank', ['Sihir'])
const SIHIR = hero('Sihir', 'Mage', ['Alfa'])
const HEROES = [A, B, TAMENG, SIHIR]

describe('filterHeroes', () => {
  it('mencari tanpa peduli huruf besar dan mengurutkan nama', () => {
    expect(filterHeroes(HEROES, ' S ', 'Semua').map((item) => item.name)).toEqual([
      'Busur',
      'Sihir',
    ])
  })

  it('menyaring berdasarkan role', () => {
    expect(filterHeroes(HEROES, '', 'Tank')).toEqual([TAMENG])
  })
})

describe('getRecommendations', () => {
  it('kosong bila belum ada musuh', () => {
    expect(getRecommendations(HEROES, [], 'Semua')).toEqual([])
  })

  it('mengurutkan dari yang meng-counter paling banyak musuh', () => {
    const result = getRecommendations(HEROES, [A, B], 'Semua')
    expect(result.map((item) => item.hero.name)).toEqual(['Tameng', 'Sihir'])
    expect(result[0].counters).toEqual([A, B])
    expect(result[0].score).toBe(4)
  })

  it('mengurangi skor bila musuh meng-counter balik', () => {
    const [sihir] = getRecommendations(HEROES, [A], 'Mage')
    expect(sihir.threats).toEqual([A])
    expect(sihir.score).toBe(1)
  })

  it('tidak merekomendasikan hero yang sudah dipilih musuh', () => {
    const result = getRecommendations(HEROES, [B, A], 'Semua')
    expect(result.some((item) => item.hero.name === 'Alfa')).toBe(false)
  })
})
