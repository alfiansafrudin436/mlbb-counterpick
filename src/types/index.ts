import type { z } from 'zod'
import type { curatedHeroSchema } from '@/lib/content-schema'
import type { ALL_ROLES, ROLES } from '@/lib/roles'

export type Role = (typeof ROLES)[number]

export type RoleFilter = Role | typeof ALL_ROLES

// Entri hasil kurasi di content/heroes.yaml.
export type CuratedHero = z.infer<typeof curatedHeroSchema>

// Data satu hero dari API Mobile Legends.
export type ApiHero = {
  name: string
  image?: string
  role?: Role
  // Hero yang di-counter oleh hero ini.
  counters?: string
  // Hero yang meng-counter hero ini.
  counteredBy?: string
}

export type Hero = {
  name: string
  roles: Role[]
  // Alasan singkat kenapa hero ini bisa di-counter; kosong bila belum dikurasi.
  weakness?: string
  // Nama hero yang meng-counter hero ini.
  counteredBy: string[]
  // URL potret hero; kosong bila belum ada gambarnya.
  image?: string
}

export type Recommendation = {
  hero: Hero
  // Musuh yang di-counter oleh hero ini.
  counters: Hero[]
  // Musuh yang meng-counter balik hero ini.
  threats: Hero[]
  score: number
}
