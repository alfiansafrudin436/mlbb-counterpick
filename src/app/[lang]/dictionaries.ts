import 'server-only'
import type { Dictionary, Locale } from '@/types'

// Kamus dimuat di server per bahasa; hanya bagian yang dibutuhkan yang dikirim ke client lewat props.
const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  id: () => import('./dictionaries/id.json').then((module) => module.default),
  en: () => import('./dictionaries/en.json').then((module) => module.default),
}

export const getDictionary = async (locale: Locale) => {
  return dictionaries[locale]()
}
