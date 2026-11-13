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
  image: z.url().optional(),
  traits: z.array(z.enum(CURATED_TRAITS)).optional(),
  weakness: localizedTextSchema,
  counteredBy: z.array(z.string().min(1)).min(1),
})

export const heroesFileSchema = z.array(curatedHeroSchema).min(1)

// content/items.yaml — katalog item yang berlaku sekarang.
export const itemsFileSchema = z.strictObject({
  updatedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format tanggal harus YYYY-MM-DD'),
  source: z.string().min(1),
  categories: z.record(z.string().min(1), z.array(z.string().min(1)).min(1)),
  aliases: z.record(z.string().min(1), z.string().min(1)).optional(),
})

// Bentuk detail hero dari API Mobile Legends — hanya field yang dipakai.
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

// content/api-heroes.json — salinan data API yang dibuat oleh scripts/sync-heroes.mjs.
export const apiSnapshotSchema = z.object({
  fetchedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format tanggal harus YYYY-MM-DD'),
  source: z.string().min(1),
  heroes: z.array(
    z.object({
      name: z.string().min(1),
      // Path gambar potret, mis. "//host/path.png?w=…".
      key: z.string().nullish(),
      detail: apiHeroDetailSchema.shape.data.nullish(),
    }),
  ),
})
