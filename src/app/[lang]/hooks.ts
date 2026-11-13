'use client'

import { useMemo, useState } from 'react'
import { MAX_ENEMIES } from '@/lib/heroes'
import { ALL_ROLES } from '@/lib/roles'
import { useDraftStore } from '@/store/draft-store'
import type { Hero, RoleFilter } from '@/types'
import { filterHeroes, getRecommendations } from './helper'

export const useHomePage = (allHeroes: Hero[]) => {
  const savedEnemies = useDraftStore((state) => state.enemies)
  const toggleEnemy = useDraftStore((state) => state.toggleEnemy)
  const reset = useDraftStore((state) => state.reset)

  const [search, setSearch] = useState('')
  const [pickRole, setPickRole] = useState<RoleFilter>(ALL_ROLES)
  const [recommendationRole, setRecommendationRole] = useState<RoleFilter>(ALL_ROLES)

  // Nama tersimpan yang sudah tidak ada di roster diabaikan.
  const enemies = useMemo(() => {
    const byName = new Map(allHeroes.map((hero) => [hero.name, hero]))
    return savedEnemies
      .map((name) => byName.get(name))
      .filter((hero): hero is Hero => Boolean(hero))
  }, [allHeroes, savedEnemies])
  const enemyNames = useMemo(() => enemies.map((hero) => hero.name), [enemies])

  const heroes = useMemo(
    () => filterHeroes(allHeroes, search, pickRole),
    [allHeroes, search, pickRole],
  )
  const recommendations = useMemo(
    () => getRecommendations(allHeroes, enemies, recommendationRole),
    [allHeroes, enemies, recommendationRole],
  )

  return {
    enemies,
    enemyNames,
    // Dihitung dari nama tersimpan agar sejalan dengan batas di store.
    isFull: savedEnemies.length >= MAX_ENEMIES,
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
