import { z } from 'zod'
import { ROLES } from '@/lib/roles'

export const roleSchema = z.enum(ROLES)

// Satu entri di content/heroes.yaml.
export const curatedHeroSchema = z.strictObject({
  name: z.string().min(1),
  roles: z.array(roleSchema).min(1),
  weakness: z.string().min(1),
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
const apiRelationSchema = z.object({ name: z.string().nullish() }).nullish()

export const apiHeroDetailSchema = z.object({
  data: z.object({
    type: z.string().nullish(),
    counters: z
      .object({
        counters: apiRelationSchema,
        countered: apiRelationSchema,
      })
      .nullish(),
  }),
})
