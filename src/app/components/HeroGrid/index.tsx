import { HeroAvatar } from '@/components'
import { cn } from '@/lib/utils'
import type { Hero } from '@/types'

type HeroGridProps = {
  heroes: Hero[]
  selected: string[]
  isFull: boolean
  onToggle: (name: string) => void
}

export const HeroGrid = ({ heroes, selected, isFull, onToggle }: HeroGridProps) => {
  if (!heroes.length) {
    return <p className="px-3 py-10 text-center text-muted-foreground">Hero tidak ditemukan.</p>
  }

  return (
    <div className="grid max-h-[460px] grid-cols-[repeat(auto-fill,minmax(84px,1fr))] gap-1.5 overflow-y-auto p-0.5">
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
              'flex min-w-0 cursor-pointer flex-col items-center gap-1 rounded-[10px] border border-transparent bg-muted px-1 py-2 text-xs transition-colors hover:border-primary disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:border-transparent',
              picked && 'border-danger bg-danger/15 hover:border-danger',
            )}
          >
            <HeroAvatar hero={hero} />
            <span className="max-w-full truncate">{hero.name}</span>
          </button>
        )
      })}
    </div>
  )
}
