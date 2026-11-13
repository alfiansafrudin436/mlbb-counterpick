import { z } from 'zod'
import { ROLES } from '@/lib/roles'
import { CURATED_TRAITS } from '@/lib/traits'

export const roleSchema = z.enum(ROLES)

// Teks per bahasa; setiap bahasa di LOCALES wajib diisi.
export const localizedTextSchema = z.strictObject({
  id: z.string().min(1),
  en: z.string().min(1),
})

// Satu entri di content/heroes.yaml.
export const curatedHeroSchema = z.strictObject({
  name: z.string().min(1),
  roles: z.array(roleSchema).min(1),
  traits: z.array(z.enum(CURATED_TRAITS)).optional(),
  weakness: localizedTextSchema,
  counteredBy: z.array(z.string().min(1)).min(1),
})

export const heroesFileSchema = z.array(curatedHeroSchema).min(1)

// Respons API Mobile Legends — hanya field yang dipakai, sisanya diabaikan.
export const apiHeroListSchema = z.object({
  data: z.array(
    z.object({
      name: z.string().min(1),
      heroid: z.string().min(1),
      key: z.string().optional(),
    }),
  ),
})

// Hero baru sering belum punya relasi counter: API mengisinya dengan null.
// Satu item di build bawaan hero.
const apiGearItemSchema = z
  .object({
    equip: z.object({ name: z.string().nullish(), icon: z.string().nullish() }).nullish(),
  })
  .nullish()

const apiRelationSchema = z.object({ name: z.string().nullish() }).nullish()

export const apiHeroDetailSchema = z.object({
  data: z.object({
    type: z.string().nullish(),
    gear: z.object({ out_pack: z.array(apiGearItemSchema).nullish() }).nullish(),
    counters: z
      .object({
        counters: apiRelationSchema,
        countered: apiRelationSchema,
      })
      .nullish(),
  }),
})
