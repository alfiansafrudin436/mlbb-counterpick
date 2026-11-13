import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { parse } from 'yaml'
import { heroesFileSchema, itemsFileSchema } from '@/lib/content-schema'
import { HERO_IMAGE_HOSTS } from '@/lib/image-hosts'
import type { CuratedHero, ItemCatalog } from '@/types'

// Loader murni (tanpa API Next.js) supaya bisa dipakai di build dan di test.

export const CONTENT_DIR = path.join(process.cwd(), 'content')

const HEROES_FILE = 'heroes.yaml'
const ITEMS_FILE = 'items.yaml'

export class ContentError extends Error {
  constructor(file: string, message: string) {
    super(`[content] ${file}: ${message}`)
    this.name = 'ContentError'
  }
}

export const loadCuratedHeroes = async (dir = CONTENT_DIR): Promise<CuratedHero[]> => {
  const raw = parse(await readFile(path.join(dir, HEROES_FILE), 'utf8'))
  const result = heroesFileSchema.safeParse(raw)
  if (!result.success) {
    throw new ContentError(HEROES_FILE, result.error.message)
  }

  const names = new Set<string>()
  for (const hero of result.data) {
    if (names.has(hero.name)) {
      throw new ContentError(HEROES_FILE, `hero "${hero.name}" duplikat`)
    }
    names.add(hero.name)
  }

  for (const hero of result.data) {
    // next/image hanya mengizinkan host yang terdaftar; host lain akan gagal saat render.
    if (hero.image) {
      const url = new URL(hero.image)
      if (url.protocol !== 'https:' || !HERO_IMAGE_HOSTS.includes(url.hostname)) {
        throw new ContentError(
          HEROES_FILE,
          `gambar "${hero.name}" harus https dari host yang diizinkan, bukan ${url.hostname}`,
        )
      }
    }
    for (const counter of hero.counteredBy) {
      if (counter === hero.name) {
        throw new ContentError(HEROES_FILE, `"${hero.name}" tidak boleh meng-counter dirinya`)
      }
      if (!names.has(counter)) {
        throw new ContentError(
          HEROES_FILE,
          `counter "${counter}" milik "${hero.name}" tidak ada di file`,
        )
      }
    }
  }

  return result.data
}

export const loadItemCatalog = async (dir = CONTENT_DIR): Promise<ItemCatalog> => {
  const raw = parse(await readFile(path.join(dir, ITEMS_FILE), 'utf8'))
  const result = itemsFileSchema.safeParse(raw)
  if (!result.success) {
    throw new ContentError(ITEMS_FILE, result.error.message)
  }

  const names = new Set<string>()
  for (const [category, items] of Object.entries(result.data.categories)) {
    for (const item of items) {
      if (names.has(item)) {
        throw new ContentError(ITEMS_FILE, `item "${item}" duplikat (kategori ${category})`)
      }
      names.add(item)
    }
  }
  for (const [from, to] of Object.entries(result.data.aliases ?? {})) {
    if (!names.has(to)) {
      throw new ContentError(ITEMS_FILE, `alias "${from}" menunjuk item "${to}" yang tidak ada`)
    }
  }

  return result.data
}
