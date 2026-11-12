'use client'

import { useMemo, useState } from 'react'
import { getHero, HEROES, MAX_ENEMIES } from '@/lib/heroes'
import { ALL_ROLES } from '@/lib/roles'
import { useDraftStore } from '@/store/draft-store'
import type { Hero, RoleFilter } from '@/types'
import { filterHeroes, getRecommendations } from './helper'

export const useHomePage = () => {
  const enemyNames = useDraftStore((state) => state.enemies)
  const toggleEnemy = useDraftStore((state) => state.toggleEnemy)
  const reset = useDraftStore((state) => state.reset)

  const [search, setSearch] = useState('')
  const [pickRole, setPickRole] = useState<RoleFilter>(ALL_ROLES)
  const [recommendationRole, setRecommendationRole] = useState<RoleFilter>(ALL_ROLES)

  const enemies = useMemo(
    () => enemyNames.map(getHero).filter((hero): hero is Hero => Boolean(hero)),
    [enemyNames],
  )
  const heroes = useMemo(() => filterHeroes(HEROES, search, pickRole), [search, pickRole])
  const recommendations = useMemo(
    () => getRecommendations(HEROES, enemies, recommendationRole),
    [enemies, recommendationRole],
  )

  return {
    enemies,
    enemyNames,
    isFull: enemyNames.length >= MAX_ENEMIES,
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
  }
}
