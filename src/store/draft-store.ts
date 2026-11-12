import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { getHero, MAX_ENEMIES } from '@/lib/heroes'

type DraftState = {
  // Nama hero musuh, urut sesuai waktu dipilih.
  enemies: string[]
  toggleEnemy: (name: string) => void
  reset: () => void
}

export const useDraftStore = create<DraftState>()(
  persist(
    (set) => ({
      enemies: [],
      toggleEnemy: (name) =>
        set((state) => {
          if (state.enemies.includes(name)) {
            return { enemies: state.enemies.filter((enemy) => enemy !== name) }
          }
          if (state.enemies.length >= MAX_ENEMIES) return state
          return { enemies: [...state.enemies, name] }
        }),
      reset: () => set({ enemies: [] }),
    }),
    {
      name: 'mlbb-counter-pick-draft',
      skipHydration: true,
      partialize: (state) => ({ enemies: state.enemies }),
      merge: (persisted, current) => {
        const saved = (persisted ?? {}) as Partial<DraftState>
        // Nama yang sudah tidak ada di data diabaikan.
        const enemies = Array.isArray(saved.enemies)
          ? saved.enemies
              .filter((name): name is string => typeof name === 'string' && Boolean(getHero(name)))
              .slice(0, MAX_ENEMIES)
          : []
        return { ...current, enemies }
      },
    },
  ),
)
