// Mengambil data hero dari API lama Mobile Legends dan menyimpannya ke content/api-heroes.json.
//
// Situs TIDAK memanggil API ini saat berjalan atau saat build — ia hanya membaca file hasilnya.
// Jalankan skrip ini secara manual (`pnpm sync:heroes`) bila ingin menyegarkan datanya,
// lalu periksa diff-nya sebelum commit.
import { writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const API_BASE = 'https://mapi.mobilelegends.com'
const OUTPUT = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
  'content',
  'api-heroes.json',
)
const CONCURRENCY = 4
const TIMEOUT_MS = 15_000

const fetchJson = async (pathname) => {
  const response = await fetch(`${API_BASE}${pathname}`, {
    signal: AbortSignal.timeout(TIMEOUT_MS),
  })
  if (!response.ok) throw new Error(`${pathname} → HTTP ${response.status}`)
  return response.json()
}

// Hanya field yang dipakai situs yang disimpan, supaya file kecil dan diff-nya mudah dibaca.
const trimDetail = (data) => ({
  type: data?.type ?? null,
  counters: {
    counters: { name: data?.counters?.counters?.name ?? null },
    countered: { name: data?.counters?.countered?.name ?? null },
  },
  gear: {
    out_pack: (data?.gear?.out_pack ?? []).map((item) => ({
      equip: { name: item?.equip?.name ?? null, icon: item?.equip?.icon ?? null },
    })),
  },
})

const main = async () => {
  const list = await fetchJson('/hero/list?language=en')
  if (!Array.isArray(list?.data) || !list.data.length) {
    throw new Error('Daftar hero kosong atau bentuknya tidak dikenal')
  }

  const heroes = new Array(list.data.length)
  let next = 0
  const worker = async () => {
    while (next < list.data.length) {
      const index = next++
      const item = list.data[index]
      const detail = await fetchJson(
        `/hero/detail?id=${encodeURIComponent(item.heroid)}&language=en`,
      )
      heroes[index] = { name: item.name, key: item.key ?? null, detail: trimDetail(detail?.data) }
    }
  }
  // Bila satu saja gagal, seluruh proses gagal — file lama tidak ditimpa dengan data setengah jadi.
  await Promise.all(Array.from({ length: CONCURRENCY }, worker))

  heroes.sort((a, b) => a.name.localeCompare(b.name))
  const snapshot = {
    fetchedAt: new Date().toISOString().slice(0, 10),
    source: `${API_BASE}/hero/list + /hero/detail`,
    heroes,
  }
  await writeFile(OUTPUT, `${JSON.stringify(snapshot, null, 2)}\n`)
  console.log(`Tersimpan ${heroes.length} hero ke ${path.relative(process.cwd(), OUTPUT)}`)
}

main().catch((error) => {
  console.error('Gagal menyegarkan data hero:', error)
  process.exitCode = 1
})
