import { describe, expect, it } from 'vitest'
import { apiHeroDetailSchema } from './content-schema'

describe('apiHeroDetailSchema', () => {
  it('menerima detail lengkap', () => {
    const result = apiHeroDetailSchema.safeParse({
      data: {
        type: 'Assassin',
        counters: { counters: { name: 'Layla' }, countered: { name: 'Akai' } },
      },
    })
    expect(result.success).toBe(true)
  })

  // Bentuk nyata dari API untuk hero yang belum punya relasi counter.
  it('menerima relasi counter bernilai null', () => {
    const result = apiHeroDetailSchema.safeParse({
      data: {
        type: 'Support',
        counters: { counters: { name: null }, countered: { name: null } },
      },
    })
    expect(result.success).toBe(true)
  })

  it('menerima detail tanpa blok counters', () => {
    expect(apiHeroDetailSchema.safeParse({ data: { type: 'Tank' } }).success).toBe(true)
  })
})
