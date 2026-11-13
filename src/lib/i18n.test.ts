import { describe, expect, it } from 'vitest'
import en from '@/app/[lang]/dictionaries/en.json'
import id from '@/app/[lang]/dictionaries/id.json'
import { format, hasLocale, pickLocale } from './i18n'

// Kumpulan "bagian.kunci" beserta placeholder-nya, untuk membandingkan dua kamus.
const describeKeys = (dictionary: Record<string, Record<string, string>>) => {
  return Object.entries(dictionary)
    .flatMap(([section, entries]) =>
      Object.entries(entries).map(([key, text]) => {
        const placeholders = [...text.matchAll(/\{(\w+)\}/g)].map((match) => match[1]).sort()
        return `${section}.${key}(${placeholders.join(',')})`
      }),
    )
    .sort()
}

describe('kamus', () => {
  it('id dan en punya kunci dan placeholder yang sama', () => {
    expect(describeKeys(en)).toEqual(describeKeys(id))
  })

  it('tidak ada teks kosong', () => {
    for (const dictionary of [id, en]) {
      for (const entries of Object.values(dictionary)) {
        for (const [key, text] of Object.entries(entries)) {
          expect(text.trim(), key).not.toBe('')
        }
      }
    }
  })
})

describe('format', () => {
  it('mengisi placeholder', () => {
    expect(format('Counter {count}/{total}', { count: 2, total: 5 })).toBe('Counter 2/5')
  })

  it('membiarkan placeholder yang tidak diberi nilai', () => {
    expect(format('Hapus {name}', {})).toBe('Hapus {name}')
  })
})

describe('pickLocale', () => {
  it('memilih bahasa dengan prioritas tertinggi yang didukung', () => {
    expect(pickLocale('en-US,en;q=0.9,id;q=0.8')).toBe('en')
    expect(pickLocale('fr-FR,fr;q=0.9,id;q=0.5,en;q=0.4')).toBe('id')
  })

  it('jatuh ke bahasa bawaan bila tidak ada yang cocok', () => {
    expect(pickLocale('ja-JP,ja;q=0.9')).toBe('id')
    expect(pickLocale(null)).toBe('id')
  })
})

describe('hasLocale', () => {
  it('hanya menerima bahasa yang didukung', () => {
    expect(hasLocale('en')).toBe(true)
    expect(hasLocale('fr')).toBe(false)
  })
})
