import { XIcon } from 'lucide-react'
import { HeroAvatar } from '@/components'
import { MAX_ENEMIES } from '@/lib/heroes'
import { format } from '@/lib/i18n'
import type { Hero, PickerDictionary } from '@/types'

type EnemySlotsProps = {
  enemies: Hero[]
  onRemove: (name: string) => void
  dict: Pick<PickerDictionary, 'emptySlot' | 'removeEnemy'>
}

const SLOT_CLASS =
  'clip-corners-sm relative flex min-h-[112px] min-w-0 flex-col items-center justify-center gap-1.5 px-1 py-2.5 text-center text-xs'

// Baris pick tim lawan: lima slot, terisi dari kiri.
export const EnemySlots = ({ enemies, onRemove, dict }: EnemySlotsProps) => {
  return (
    <div className="grid grid-cols-5 gap-2">
      {Array.from({ length: MAX_ENEMIES }, (_, index) => {
        const hero = enemies[index]
        if (!hero) {
          return (
            <div key={index} className={`${SLOT_CLASS} bg-muted/50 text-muted-foreground`}>
              <span className="font-display text-3xl leading-none font-bold text-input">
                {index + 1}
              </span>
              <span>{dict.emptySlot}</span>
            </div>
          )
        }
        const removeLabel = format(dict.removeEnemy, { name: hero.name })
        return (
          <button
            key={hero.name}
            type="button"
            onClick={() => onRemove(hero.name)}
            aria-label={removeLabel}
            title={removeLabel}
            className={`${SLOT_CLASS} group animate-pop cursor-pointer bg-linear-to-b from-danger/30 to-danger/5 transition-colors hover:from-danger/45`}
          >
            <HeroAvatar hero={hero} size="lg" className="max-sm:size-12" />
            <span className="max-w-full truncate font-semibold">{hero.name}</span>
            <span
              aria-hidden
              className="absolute top-1.5 right-1.5 inline-flex size-5 items-center justify-center rounded-full bg-background/70 text-muted-foreground transition-colors group-hover:bg-danger group-hover:text-foreground"
            >
              <XIcon className="size-3.5" />
            </span>
          </button>
        )
      })}
    </div>
  )
}
