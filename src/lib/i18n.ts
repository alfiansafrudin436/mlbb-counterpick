import type { Locale } from '@/types'

// Helper bahasa yang murni: dipakai di server, client, dan proxy.

export const LOCALES = ['id', 'en'] as const

export const DEFAULT_LOCALE: Locale = 'id'

export const LOCALE_LABELS: Record<Locale, string> = {
  id: 'Indonesia',
  en: 'English',
}

export const hasLocale = (value: string): value is Locale => {
  return (LOCALES as readonly string[]).includes(value)
}

// Mengisi placeholder `{nama}` di teks kamus: format('Hapus {name}', { name: 'Fanny' }).
export const format = (template: string, values: Record<string, string | number>) => {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  )
}

// Memilih bahasa dari header Accept-Language, mis. "en-US,en;q=0.9,id;q=0.8" → "en".
export const pickLocale = (acceptLanguage: string | null | undefined): Locale => {
  if (!acceptLanguage) return DEFAULT_LOCALE
  const preferred = acceptLanguage
    .split(',')
    .map((part) => {
      const [tag, quality] = part.trim().split(';q=')
      return { language: tag.split('-')[0].toLowerCase(), quality: quality ? Number(quality) : 1 }
    })
    .filter((item) => !Number.isNaN(item.quality))
    .sort((a, b) => b.quality - a.quality)
  return preferred.map((item) => item.language).find(hasLocale) ?? DEFAULT_LOCALE
}
