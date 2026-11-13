import type { z } from 'zod'
import type id from '@/app/[lang]/dictionaries/id.json'
import type { curatedHeroSchema } from '@/lib/content-schema'
import type { LOCALES } from '@/lib/i18n'
import type { ALL_ROLES, ROLES } from '@/lib/roles'
import type { TRAITS } from '@/lib/traits'

export type Locale = (typeof LOCALES)[number]

// Bentuk kamus mengikuti id.json; en.json wajib punya kunci yang sama.
export type Dictionary = typeof id

export type PickerDictionary = Dictionary['picker']

export type Role = (typeof ROLES)[number]

export type RoleFilter = Role | typeof ALL_ROLES

// Sifat hero yang dipakai aturan build: heal, cc, burst, magic, physical, tank.
export type Trait = (typeof TRAITS)[number]

// Entri hasil kurasi di content/heroes.yaml.
export type CuratedHero = z.infer<typeof curatedHeroSchema>

export type BuildItem = {
  name: string
  // URL ikon item; kosong bila item tidak ada di katalog API.
  icon?: string
}

// Data satu hero dari API Mobile Legends.
export type ApiHero = {
  name: string
  image?: string
  role?: Role
  // Hero yang di-counter oleh hero ini.
  counters?: string
  // Hero yang meng-counter hero ini.
  counteredBy?: string
  // Build bawaan yang disarankan API.
  build?: BuildItem[]
}

export type Hero = {
  name: string
  roles: Role[]
  // Sifat hasil kurasi ditambah yang diturunkan dari role.
  traits: Trait[]
  // Alasan singkat kenapa hero ini bisa di-counter, dalam bahasa aktif; kosong bila belum dikurasi.
  weakness?: string
  // Nama hero yang meng-counter hero ini.
  counteredBy: string[]
  // URL potret hero; kosong bila belum ada gambarnya.
  image?: string
  // Build bawaan dari API; kosong bila API tidak tersedia.
  build: BuildItem[]
}

// Kunci kamus untuk alasan sebuah saran, mis. "reasonAntiHeal".
export type LoadoutReason = Extract<keyof PickerDictionary, `reason${string}`>

// Item situasional yang disarankan karena musuh tertentu.
export type LoadoutAdjustment = {
  item: string
  reason: LoadoutReason
  enemies: string[]
}

export type LoadoutPick = {
  name: string
  reason: LoadoutReason
  enemies: string[]
}

export type Loadout = {
  build: BuildItem[]
  adjustments: LoadoutAdjustment[]
  emblem: string
  talent: string
  spell: LoadoutPick
}

export type Recommendation = {
  hero: Hero
  // Musuh yang di-counter oleh hero ini.
  counters: Hero[]
  // Musuh yang meng-counter balik hero ini.
  threats: Hero[]
  score: number
  // Saran build, emblem, dan spell melawan tim musuh saat ini.
  loadout: Loadout
}
