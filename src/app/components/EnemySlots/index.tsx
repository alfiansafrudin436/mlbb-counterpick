import { HeroAvatar } from '@/components'
import { MAX_ENEMIES } from '@/lib/heroes'
import type { Hero } from '@/types'

type EnemySlotsProps = {
  enemies: Hero[]
  onRemove: (name: string) => void
}

const SLOT_CLASS =
  'flex min-h-[84px] min-w-0 flex-col items-center justify-center gap-1 rounded-[10px] px-1 py-2 text-center text-xs'

export const EnemySlots = ({ enemies, onRemove }: EnemySlotsProps) => {
  return (
    <div className="grid grid-cols-5 gap-2">
      {Array.from({ length: MAX_ENEMIES }, (_, index) => {
        const hero = enemies[index]
        if (!hero) {
          return (
            <div key={index} className={`${SLOT_CLASS} border border-dashed text-muted-foreground`}>
              Musuh {index + 1}
            </div>
          )
        }
        return (
          <button
            key={hero.name}
            type="button"
            onClick={() => onRemove(hero.name)}
            aria-label={`Hapus ${hero.name} dari musuh`}
            title={`Hapus ${hero.name}`}
            className={`${SLOT_CLASS} cursor-pointer border bg-muted transition-colors hover:border-danger`}
          >
            <HeroAvatar hero={hero} />
            <span className="max-w-full truncate">{hero.name}</span>
          </button>
        )
      })}
    </div>
  )
}
