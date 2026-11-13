'use client'

import { RotateCcwIcon, SearchIcon, SkullIcon, TrophyIcon } from 'lucide-react'
import { Panel, RoleChips } from '@/components'
import { Button } from '@/components/ui/button'
import { MAX_ENEMIES } from '@/lib/heroes'
import type { Hero, PickerDictionary } from '@/types'
import { useHomePage } from '../../hooks'
import { EnemySlots } from '../EnemySlots'
import { HeroGrid } from '../HeroGrid'
import { RecommendationList } from '../RecommendationList'

type CounterPickerProps = {
  heroes: Hero[]
  dict: PickerDictionary
}

export const CounterPicker = ({ heroes: allHeroes, dict }: CounterPickerProps) => {
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
    <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
      <Panel
        id="judul-musuh"
        title={dict.enemyTeam}
        icon={SkullIcon}
        tone="danger"
        aside={
          <div className="flex items-center gap-3">
            <span className="font-display text-xl font-bold text-muted-foreground tabular-nums">
              <span className="text-danger">{enemies.length}</span>/{MAX_ENEMIES}
            </span>
            <Button size="sm" onClick={reset} disabled={!enemies.length}>
              <RotateCcwIcon aria-hidden />
              {dict.reset}
            </Button>
          </div>
        }
      >
        <EnemySlots enemies={enemies} onRemove={toggleEnemy} dict={dict} />

        <div className="relative mt-4">
          <SearchIcon
            aria-hidden
            className="pointer-events-none absolute top-1/2 left-3 size-[18px] -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={dict.searchPlaceholder}
            aria-label={dict.searchLabel}
            autoComplete="off"
            className="h-11 w-full rounded-[10px] border border-input bg-background/70 pr-3 pl-10 transition-colors placeholder:text-muted-foreground focus:border-accent"
          />
        </div>
        <RoleChips
          label={dict.enemyRoleFilter}
          allLabel={dict.allRoles}
          value={pickRole}
          onChange={setPickRole}
          className="my-3"
        />
        <HeroGrid
          heroes={heroes}
          selected={enemyNames}
          isFull={isFull}
          onToggle={toggleEnemy}
          emptyText={dict.noHeroFound}
        />
      </Panel>

      <Panel id="judul-rekomendasi" title={dict.recommendations} icon={TrophyIcon}>
        <RoleChips
          label={dict.recommendationRoleFilter}
          allLabel={dict.allRoles}
          value={recommendationRole}
          onChange={setRecommendationRole}
          className="mb-4"
        />
        <RecommendationList
          enemyCount={enemies.length}
          recommendations={recommendations}
          dict={dict}
        />
      </Panel>
    </div>
  )
}
