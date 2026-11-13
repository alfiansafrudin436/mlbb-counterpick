import { ChevronDownIcon, ShieldHalfIcon, SparklesIcon, ZapIcon } from 'lucide-react'
import Image from 'next/image'
import { format } from '@/lib/i18n'
import { getInitials } from '@/lib/utils'
import type { BuildItem, Loadout, PickerDictionary } from '@/types'

type LoadoutPanelProps = {
  loadout: Loadout
  // Katalog ikon item (nama → URL) untuk item situasional.
  itemIcons: Record<string, string>
  dict: PickerDictionary
}

type ItemIconProps = {
  item: BuildItem
}

const ItemIcon = ({ item }: ItemIconProps) => {
  return (
    <span
      aria-hidden
      className="inline-flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-input bg-background font-display text-xs font-bold text-muted-foreground"
    >
      {item.icon ? (
        <Image src={item.icon} alt="" width={40} height={40} className="size-full object-cover" />
      ) : (
        getInitials(item.name)
      )}
    </span>
  )
}

const HEADING_CLASS =
  'font-display text-[13px] font-bold tracking-wider text-muted-foreground uppercase'

// Bagian yang bisa dibuka di kartu rekomendasi: build dasar, item situasional, emblem, dan spell.
export const LoadoutPanel = ({ loadout, itemIcons, dict }: LoadoutPanelProps) => {
  const { build, adjustments, emblem, talent, spell } = loadout
  const describe = (reason: keyof PickerDictionary, enemies: string[]) =>
    format(dict[reason], { names: enemies.join(', ') })

  return (
    <details className="group mt-3 border-t border-border/70 pt-1">
      <summary className="flex min-h-11 cursor-pointer list-none items-center gap-1.5 font-display text-[15px] font-semibold tracking-wide text-accent uppercase [&::-webkit-details-marker]:hidden">
        <ChevronDownIcon
          aria-hidden
          className="size-4 transition-transform group-open:rotate-180"
        />
        {dict.loadoutToggle}
        {adjustments.length > 0 && (
          <span className="rounded-sm bg-accent/15 px-1.5 py-0.5 text-[11px] leading-none">
            +{adjustments.length}
          </span>
        )}
      </summary>

      <div className="flex flex-col gap-4 pt-1 pb-1">
        <section>
          <h4 className={HEADING_CLASS}>{dict.loadoutBuild}</h4>
          {build.length ? (
            <ul className="mt-2 grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-2">
              {build.map((item) => (
                <li key={item.name} className="flex min-w-0 items-center gap-2 text-[13px]">
                  <ItemIcon item={item} />
                  <span className="min-w-0 wrap-anywhere">{item.name}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-1.5 text-[13px] text-muted-foreground">{dict.loadoutNoBuild}</p>
          )}
        </section>

        <section>
          <h4 className={HEADING_CLASS}>{dict.loadoutAdjust}</h4>
          {adjustments.length ? (
            <ul className="mt-2 flex flex-col gap-2">
              {adjustments.map((adjustment) => (
                <li key={adjustment.item} className="flex min-w-0 items-center gap-2.5 text-[13px]">
                  <ItemIcon item={{ name: adjustment.item, icon: itemIcons[adjustment.item] }} />
                  <span className="min-w-0 wrap-anywhere">
                    <span className="font-semibold text-foreground">{adjustment.item}</span>
                    <span className="text-muted-foreground">
                      {' — '}
                      {describe(adjustment.reason, adjustment.enemies)}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-1.5 text-[13px] text-muted-foreground">{dict.loadoutNoAdjust}</p>
          )}
        </section>

        <dl className="grid gap-x-4 gap-y-3 text-[13px] sm:grid-cols-3">
          <div className="flex items-start gap-2">
            <ShieldHalfIcon aria-hidden className="mt-0.5 size-4 shrink-0 text-primary" />
            <div className="min-w-0">
              <dt className={HEADING_CLASS}>{dict.loadoutEmblem}</dt>
              <dd className="font-semibold">{emblem}</dd>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <SparklesIcon aria-hidden className="mt-0.5 size-4 shrink-0 text-primary" />
            <div className="min-w-0">
              <dt className={HEADING_CLASS}>{dict.loadoutTalent}</dt>
              <dd className="font-semibold">{talent}</dd>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <ZapIcon aria-hidden className="mt-0.5 size-4 shrink-0 text-primary" />
            <div className="min-w-0">
              <dt className={HEADING_CLASS}>{dict.loadoutSpell}</dt>
              <dd>
                <span className="font-semibold">{spell.name}</span>
                <span className="block text-muted-foreground">
                  {describe(spell.reason, spell.enemies)}
                </span>
              </dd>
            </div>
          </div>
        </dl>
      </div>
    </details>
  )
}
