import type { Role, Trait } from '@/types'

// Sifat yang boleh ditulis di content/heroes.yaml.
export const CURATED_TRAITS = ['heal', 'cc', 'burst', 'magic', 'physical'] as const

// Semua sifat, termasuk yang hanya diturunkan dari role.
export const TRAITS = [...CURATED_TRAITS, 'tank'] as const

const MAGIC_ROLES: Role[] = ['Mage', 'Support']

// Melengkapi sifat kurasi dengan yang bisa ditebak dari role:
// role Tank → tank, role Assassin → burst, dan jenis damage dari role utama bila tidak ditulis.
export const resolveTraits = (roles: Role[], curated: readonly Trait[] = []): Trait[] => {
  const traits = new Set<Trait>(curated)
  if (roles.includes('Tank')) traits.add('tank')
  if (roles.includes('Assassin')) traits.add('burst')
  if (!traits.has('magic') && !traits.has('physical')) {
    traits.add(MAGIC_ROLES.includes(roles[0]) ? 'magic' : 'physical')
  }
  return TRAITS.filter((trait) => traits.has(trait))
}
