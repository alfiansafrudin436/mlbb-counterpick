import type { Hero, Loadout, LoadoutAdjustment, LoadoutPick, Role } from '@/types'

// Saran build, emblem, dan spell berbasis aturan. Titik awalnya build bawaan hero dari API;
// aturan di bawah menambahkan item situasional sesuai sifat tim musuh.
// Disusun manual dari pengetahuan umum komunitas — sesuaikan dengan patch terbaru.

export const MAX_ADJUSTMENTS = 4

// Ambang jumlah musuh agar sebuah aturan berlaku.
const MIN_MAGIC_ENEMIES = 2
const MIN_PHYSICAL_ENEMIES = 3
const MIN_CC_ENEMIES = 2
const MIN_TANK_ENEMIES = 2
const MIN_BURST_ENEMIES = 2

const FRONTLINE_ROLES: Role[] = ['Tank', 'Fighter']
const SUPPORTIVE_ROLES: Role[] = ['Tank', 'Support']

const EMBLEMS: Record<Role, { emblem: string; talent: string }> = {
  Tank: { emblem: 'Tank Emblem', talent: 'Concussive Blast' },
  Fighter: { emblem: 'Fighter Emblem', talent: 'Festival of Blood' },
  Assassin: { emblem: 'Assassin Emblem', talent: 'Killing Spree' },
  Mage: { emblem: 'Mage Emblem', talent: 'Lethal Ignition' },
  Marksman: { emblem: 'Marksman Emblem', talent: 'Weakness Finder' },
  Support: { emblem: 'Support Emblem', talent: 'Focusing Mark' },
}

const DEFAULT_SPELLS: Record<Role, string> = {
  Tank: 'Flicker',
  Fighter: 'Flicker',
  Assassin: 'Retribution',
  Mage: 'Flicker',
  Marksman: 'Flicker',
  Support: 'Flicker',
}

const names = (heroes: Hero[]) => heroes.map((hero) => hero.name)

const getSpell = (role: Role, cc: Hero[], burst: Hero[], physical: Hero[]): LoadoutPick => {
  const isBackline = role === 'Mage' || role === 'Marksman'
  if (isBackline && cc.length >= MIN_CC_ENEMIES) {
    return { name: 'Purify', reason: 'reasonSpellPurify', enemies: names(cc) }
  }
  if ((isBackline || role === 'Support') && burst.length >= MIN_BURST_ENEMIES) {
    return { name: 'Aegis', reason: 'reasonSpellAegis', enemies: names(burst) }
  }
  if (FRONTLINE_ROLES.includes(role) && physical.length >= MIN_PHYSICAL_ENEMIES) {
    return { name: 'Vengeance', reason: 'reasonSpellVengeance', enemies: names(physical) }
  }
  return { name: DEFAULT_SPELLS[role], reason: 'reasonRoleDefault', enemies: [] }
}

export const getLoadout = (hero: Hero, enemies: Hero[]): Loadout => {
  const role = hero.roles[0]
  const isFrontline = FRONTLINE_ROLES.includes(role)
  const dealsMagic = hero.traits.includes('magic')
  const withTrait = (trait: Hero['traits'][number]) =>
    enemies.filter((enemy) => enemy.traits.includes(trait))

  const heal = withTrait('heal')
  // Tank dan Support bukan sumber damage utama, jadi tidak dihitung untuk item pertahanan.
  const isDamageDealer = (enemy: Hero) => !SUPPORTIVE_ROLES.includes(enemy.roles[0])
  const magic = withTrait('magic').filter(isDamageDealer)
  const physical = withTrait('physical').filter(isDamageDealer)
  const cc = withTrait('cc')
  const tank = withTrait('tank')
  const burst = withTrait('burst')
  const marksmen = enemies.filter((enemy) => enemy.roles[0] === 'Marksman')

  // Urutan = prioritas; hanya MAX_ADJUSTMENTS pertama yang ditampilkan.
  const candidates: (LoadoutAdjustment | false)[] = [
    heal.length > 0 && {
      item: role === 'Tank' ? 'Dominance Ice' : dealsMagic ? 'Necklace of Durance' : 'Sea Halberd',
      reason: 'reasonAntiHeal',
      enemies: names(heal),
    },
    tank.length >= MIN_TANK_ENEMIES &&
      role !== 'Tank' &&
      role !== 'Support' && {
        item: dealsMagic
          ? 'Divine Glaive'
          : role === 'Marksman'
            ? 'Demon Hunter Sword'
            : 'Malefic Roar',
        reason: 'reasonAntiTank',
        enemies: names(tank),
      },
    magic.length >= MIN_MAGIC_ENEMIES && {
      item:
        role === 'Marksman'
          ? 'Rose Gold Meteor'
          : isFrontline && magic.filter((enemy) => enemy.traits.includes('burst')).length < 2
            ? 'Radiant Armor'
            : "Athena's Shield",
      reason: 'reasonMagicDefense',
      enemies: names(magic),
    },
    isFrontline &&
      physical.length >= MIN_PHYSICAL_ENEMIES && {
        item: 'Antique Cuirass',
        reason: 'reasonPhysicalDefense',
        enemies: names(physical),
      },
    isFrontline &&
      marksmen.length > 0 && {
        item: 'Blade Armor',
        reason: 'reasonAntiMarksman',
        enemies: names(marksmen),
      },
    cc.length >= MIN_CC_ENEMIES && {
      item: 'Tough Boots',
      reason: 'reasonTenacity',
      enemies: names(cc),
    },
    !isFrontline &&
      burst.length >= MIN_BURST_ENEMIES && {
        item:
          role === 'Marksman' && burst.some((enemy) => enemy.traits.includes('physical'))
            ? 'Wind of Nature'
            : 'Immortality',
        reason: 'reasonSurviveBurst',
        enemies: names(burst),
      },
  ]

  // Varian sepatu ditulis "Tough Boots - Encourage", jadi dicocokkan dari awal nama.
  const isOwned = (name: string) =>
    hero.build.some((item) => item.name === name || item.name.startsWith(`${name} -`))
  const adjustments = candidates
    .filter((item): item is LoadoutAdjustment => Boolean(item))
    // Item yang sudah ada di build bawaan tidak perlu disarankan lagi.
    .filter((item) => !isOwned(item.item))
    .slice(0, MAX_ADJUSTMENTS)

  return {
    build: hero.build,
    adjustments,
    ...EMBLEMS[role],
    spell: getSpell(role, cc, burst, physical),
  }
}
