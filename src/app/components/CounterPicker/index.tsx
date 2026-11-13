'use client'

import { RotateCcwIcon, SearchIcon } from 'lucide-react'
import { RoleChips } from '@/components'
import { Button } from '@/components/ui/button'
import { MAX_ENEMIES } from '@/lib/heroes'
import type { Hero } from '@/types'
import { useHomePage } from '../../hooks'
import { EnemySlots } from '../EnemySlots'
import { HeroGrid } from '../HeroGrid'
import { RecommendationList } from '../RecommendationList'

type CounterPickerProps = {
  heroes: Hero[]
}

export const CounterPicker = ({ heroes: allHeroes }: CounterPickerProps) => {
  const {
    enemies,
    enemyNames,
    isFull,
    toggleEnemy,
    reset,
    search,
    setSearch,
    pickRole,
    setPickRole,
    heroes,
    recommendationRole,
    setRecommendationRole,
    recommendations,
  } = useHomePage(allHeroes)

  return (
    <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
      <section aria-labelledby="judul-musuh" className="min-w-0 rounded-2xl border bg-card p-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 id="judul-musuh" className="text-[17px] font-semibold">
            Hero musuh{' '}
            <span className="ml-1 font-medium text-muted-foreground">
              {enemies.length}/{MAX_ENEMIES}
            </span>
          </h2>
          <Button size="sm" onClick={reset} disabled={!enemies.length}>
            <RotateCcwIcon aria-hidden />
            Reset
          </Button>
        </div>

        <EnemySlots enemies={enemies} onRemove={toggleEnemy} />

        <div className="relative mt-3.5">
          <SearchIcon
            aria-hidden
            className="pointer-events-none absolute top-1/2 left-3 size-[18px] -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Cari hero…"
            aria-label="Cari hero"
            autoComplete="off"
            className="h-11 w-full rounded-[10px] border border-input bg-background pr-3 pl-10 placeholder:text-muted-foreground"
          />
        </div>
        <RoleChips
          label="Filter role hero musuh"
          value={pickRole}
          onChange={setPickRole}
          className="my-3"
        />
        <HeroGrid heroes={heroes} selected={enemyNames} isFull={isFull} onToggle={toggleEnemy} />
      </section>

      <section
        aria-labelledby="judul-rekomendasi"
        className="min-w-0 rounded-2xl border bg-card p-4"
      >
        <h2 id="judul-rekomendasi" className="text-[17px] font-semibold">
          Rekomendasi hero
        </h2>
        <RoleChips
          label="Filter role rekomendasi"
          value={recommendationRole}
          onChange={setRecommendationRole}
          className="my-3"
        />
        <RecommendationList enemyCount={enemies.length} recommendations={recommendations} />
      </section>
    </div>
  )
}
