import type { Role } from '@/types'

export const ROLES = ['Tank', 'Fighter', 'Assassin', 'Mage', 'Marksman', 'Support'] as const

export const ALL_ROLES = 'Semua'

export const ROLE_FILTERS = [ALL_ROLES, ...ROLES] as const

// Kelas ditulis utuh agar terbaca oleh Tailwind.
export const ROLE_STYLES: Record<Role, string> = {
  Tank: 'border-role-tank bg-role-tank/15 text-role-tank',
  Fighter: 'border-role-fighter bg-role-fighter/15 text-role-fighter',
  Assassin: 'border-role-assassin bg-role-assassin/15 text-role-assassin',
  Mage: 'border-role-mage bg-role-mage/15 text-role-mage',
  Marksman: 'border-role-marksman bg-role-marksman/15 text-role-marksman',
  Support: 'border-role-support bg-role-support/15 text-role-support',
}
