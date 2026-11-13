import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { parse } from 'yaml'
import { heroesFileSchema } from '@/lib/content-schema'
import type { CuratedHero } from '@/types'

// Loader murni (tanpa API Next.js) supaya bisa dipakai di build dan di test.

export const CONTENT_DIR = path.join(process.cwd(), 'content')

const HEROES_FILE = 'heroes.yaml'

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
