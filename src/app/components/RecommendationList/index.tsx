import { HeroAvatar } from '@/components'
import { cn } from '@/lib/utils'
import type { Recommendation } from '@/types'

type RecommendationListProps = {
  enemyCount: number
  recommendations: Recommendation[]
}

const EMPTY_CLASS = 'px-3 py-10 text-center text-muted-foreground'

export const RecommendationList = ({ enemyCount, recommendations }: RecommendationListProps) => {
  if (!enemyCount) {
    return <p className={EMPTY_CLASS}>Pilih minimal satu hero musuh untuk melihat rekomendasi.</p>
  }

  if (!recommendations.length) {
    return <p className={EMPTY_CLASS}>Belum ada rekomendasi untuk kombinasi dan role ini.</p>
  }

  const topScore = recommendations[0].score

  return (
    <ol className="flex flex-col gap-2.5">
      {recommendations.map(({ hero, counters, threats, score }, index) => {
        const isBest = score === topScore
        return (
          <li
            key={hero.name}
            className={cn(
              'grid grid-cols-[auto_auto_1fr] items-start gap-3 rounded-xl border bg-muted p-3',
              isBest && 'border-primary',
            )}
          >
            <span
              className={cn(
                'w-6 pt-2 text-center font-bold text-muted-foreground',
                isBest && 'text-primary',
              )}
            >
              {index + 1}
            </span>
            <HeroAvatar hero={hero} />
            <div className="min-w-0">
              <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
                <h3 className="text-base font-bold">{hero.name}</h3>
                <span className="text-xs text-muted-foreground">{hero.roles.join(' / ')}</span>
                <span className="ml-auto rounded-full bg-success/15 px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap text-success">
                  Counter {counters.length}/{enemyCount} musuh
                </span>
              </div>
              <ul className="mt-2 flex flex-col gap-1 text-[13px] wrap-anywhere text-muted-foreground">
                {counters.map((enemy) => (
                  <li key={enemy.name}>
                    <span className="font-semibold text-success">Counter {enemy.name}</span>
                    {enemy.weakness && ` — ${enemy.weakness}`}
                  </li>
                ))}
                {threats.length > 0 && (
                  <li>
                    <span className="font-semibold text-danger">Hati-hati:</span> di-counter{' '}
                    {threats.map((enemy) => enemy.name).join(', ')}
                  </li>
                )}
              </ul>
            </div>
          </li>
        )
      })}
    </ol>
  )
}
