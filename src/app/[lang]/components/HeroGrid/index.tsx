import { HeroAvatar } from '@/components'
import { cn } from '@/lib/utils'
import type { Hero } from '@/types'

type HeroGridProps = {
  heroes: Hero[]
  selected: string[]
  isFull: boolean
  onToggle: (name: string) => void
  emptyText: string
}

export const HeroGrid = ({ heroes, selected, isFull, onToggle, emptyText }: HeroGridProps) => {
  if (!heroes.length) {
    return <p className="px-3 py-10 text-center text-muted-foreground">{emptyText}</p>
  }

  return (
    <div className="grid max-h-[480px] grid-cols-[repeat(auto-fill,minmax(80px,1fr))] gap-1.5 overflow-y-auto p-1">
      {heroes.map((hero) => {
        const picked = selected.includes(hero.name)
        return (
          <button
            key={hero.name}
            type="button"
            aria-pressed={picked}
            disabled={isFull && !picked}
            onClick={() => onToggle(hero.name)}
            title={`${hero.name} · ${hero.roles.join('/')}`}
            className={cn(
              'group flex min-w-0 cursor-pointer flex-col items-center gap-1.5 rounded-xl border border-transparent px-1 py-2 text-xs transition-all duration-150',
              'hover:-translate-y-0.5 hover:border-accent/60 hover:bg-accent/10',
              'disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:translate-y-0 disabled:hover:border-transparent disabled:hover:bg-transparent',
              picked && 'border-danger/70 bg-danger/15 hover:border-danger hover:bg-danger/20',
            )}
          >
            <HeroAvatar
              hero={hero}
              className={cn(
                'transition-shadow duration-150 group-hover:shadow-[0_0_14px] group-hover:shadow-accent/50 group-disabled:shadow-none',
                picked && 'border-danger grayscale-[0.6]',
              )}
            />
            <span className={cn('max-w-full truncate', picked && 'font-semibold text-danger')}>
              {hero.name}
            </span>
          </button>
        )
      })}
    </div>
  )
}
