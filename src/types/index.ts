import type { ALL_ROLES, ROLES } from '@/lib/roles'

export type Role = (typeof ROLES)[number]

export type RoleFilter = Role | typeof ALL_ROLES

export type Hero = {
  name: string
  roles: Role[]
  // Alasan singkat kenapa hero ini bisa di-counter.
  weakness: string
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
