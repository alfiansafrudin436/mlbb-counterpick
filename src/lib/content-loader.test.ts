import { mkdtemp, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { ContentError, loadCuratedHeroes } from './content-loader'

const writeContent = async (yaml: string) => {
  const dir = await mkdtemp(path.join(tmpdir(), 'mlbb-content-'))
  await writeFile(path.join(dir, 'heroes.yaml'), yaml)
  return dir
}

describe('loadCuratedHeroes', () => {
  it('konten asli valid', async () => {
    const heroes = await loadCuratedHeroes()
    expect(heroes.length).toBeGreaterThan(100)
  })

  it('menolak hero duplikat', async () => {
    const dir = await writeContent(`
- { name: Alfa, roles: [Tank], weakness: { id: Lambat, en: Slow }, counteredBy: [Beta] }
- { name: Beta, roles: [Mage], weakness: { id: Tipis, en: Squishy }, counteredBy: [Alfa] }
- { name: Alfa, roles: [Tank], weakness: { id: Lambat, en: Slow }, counteredBy: [Beta] }
`)
    await expect(loadCuratedHeroes(dir)).rejects.toThrow(ContentError)
  })

  it('menolak counter yang tidak ada di file', async () => {
    const dir = await writeContent(`
- { name: Alfa, roles: [Tank], weakness: { id: Lambat, en: Slow }, counteredBy: [Gaib] }
`)
    await expect(loadCuratedHeroes(dir)).rejects.toThrow(/Gaib/)
  })

  it('menolak kelemahan tanpa terjemahan', async () => {
    const dir = await writeContent(`
- { name: Alfa, roles: [Tank], weakness: { id: Lambat }, counteredBy: [Beta] }
- { name: Beta, roles: [Mage], weakness: { id: Tipis, en: Squishy }, counteredBy: [Alfa] }
`)
    await expect(loadCuratedHeroes(dir)).rejects.toThrow(ContentError)
  })

  it('menolak gambar dari host yang tidak diizinkan', async () => {
    const dir = await writeContent(`
- name: Alfa
  roles: [Tank]
  image: https://contoh.test/alfa.png
  weakness: { id: Lambat, en: Slow }
  counteredBy: [Beta]
- { name: Beta, roles: [Mage], weakness: { id: Tipis, en: Squishy }, counteredBy: [Alfa] }
`)
    await expect(loadCuratedHeroes(dir)).rejects.toThrow(/host/)
  })

  it('menolak role yang tidak dikenal', async () => {
    const dir = await writeContent(`
- { name: Alfa, roles: [Jungler], weakness: { id: Lambat, en: Slow }, counteredBy: [Alfa] }
`)
    await expect(loadCuratedHeroes(dir)).rejects.toThrow(ContentError)
  })
})
