import { CrownIcon, SwordsIcon, TriangleAlertIcon } from 'lucide-react'
import { HeroAvatar } from '@/components'
import { cn } from '@/lib/utils'
import type { Recommendation } from '@/types'

type RecommendationListProps = {
  enemyCount: number
  recommendations: Recommendation[]
}

const MAX_BEST_PICKS = 3

type EmptyMessageProps = {
  children: React.ReactNode
}

const EmptyMessage = ({ children }: EmptyMessageProps) => {
  return (
    <div className="flex flex-col items-center gap-3 px-3 py-14 text-center text-muted-foreground">
      <SwordsIcon aria-hidden className="size-10 text-input" />
      <p className="max-w-xs">{children}</p>
    </div>
  )
}

export const RecommendationList = ({ enemyCount, recommendations }: RecommendationListProps) => {
  if (!enemyCount) {
    return <EmptyMessage>Pilih minimal satu hero musuh untuk melihat rekomendasi.</EmptyMessage>
  }

  if (!recommendations.length) {
    return <EmptyMessage>Belum ada rekomendasi untuk kombinasi dan role ini.</EmptyMessage>
  }

  // Sorotan emas hanya bermakna bila pemenangnya sedikit; saat banyak yang seri, tidak ada yang disorot.
  const topScore = recommendations[0].score
  const hasClearBest =
    recommendations.filter((item) => item.score === topScore).length <= MAX_BEST_PICKS

  return (
    <ol className="flex flex-col gap-2.5">
      {recommendations.map(({ hero, counters, threats, score }, index) => {
        const isBest = hasClearBest && score === topScore
        return (
          <li
            key={hero.name}
            className={cn(
              'animate-rise bg-linear-to-r p-px clip-corners-sm',
              isBest ? 'from-primary via-primary/40 to-border' : 'from-border to-border',
            )}
          >
            <div
              className={cn(
                'grid grid-cols-[auto_auto_1fr] items-start gap-3 bg-muted p-3 clip-corners-sm',
                isBest && 'bg-linear-to-r from-primary/15 to-transparent',
              )}
            >
              <span
                className={cn(
                  'flex w-7 flex-col items-center pt-1 font-display text-2xl leading-none font-bold',
                  isBest ? 'text-primary' : 'text-muted-foreground',
                )}
              >
                {isBest && <CrownIcon aria-hidden className="mb-0.5 size-4" />}
                {index + 1}
              </span>
              <HeroAvatar hero={hero} className={cn(isBest && 'border-primary')} />
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                  <h3 className="font-display text-xl leading-tight font-bold tracking-wide">
                    {hero.name}
                  </h3>
                  <span className="text-xs text-muted-foreground">{hero.roles.join(' / ')}</span>
                  {isBest && (
                    <span className="rounded-sm bg-primary px-1.5 py-0.5 font-display text-[11px] leading-none font-bold tracking-wider text-primary-foreground uppercase">
                      Pilihan terbaik
                    </span>
                  )}
                </div>

                <div className="mt-2 flex items-center gap-2.5">
                  <div aria-hidden className="flex gap-1">
                    {Array.from({ length: enemyCount }, (_, pip) => (
                      <span
                        key={pip}
                        className={cn(
                          'h-1.5 w-6 -skew-x-12',
                          pip < counters.length ? 'bg-success' : 'bg-input/60',
                        )}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-semibold whitespace-nowrap text-success">
                    Counter {counters.length}/{enemyCount} musuh
                  </span>
                </div>

                <ul className="mt-2 flex flex-col gap-1 text-[13px] wrap-anywhere text-muted-foreground">
                  {counters.map((enemy) => (
                    <li key={enemy.name}>
                      <span className="font-semibold text-foreground">vs {enemy.name}</span>
                      {enemy.weakness && ` — ${enemy.weakness}`}
                    </li>
                  ))}
                  {threats.length > 0 && (
                    <li className="flex items-start gap-1.5 text-danger">
                      <TriangleAlertIcon aria-hidden className="mt-0.5 size-3.5 shrink-0" />
                      <span>
                        <span className="font-semibold">Hati-hati:</span> di-counter{' '}
                        {threats.map((enemy) => enemy.name).join(', ')}
                      </span>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </li>
        )
      })}
    </ol>
  )
}
