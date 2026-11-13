import {
  CrosshairIcon,
  HeartPulseIcon,
  LayoutGridIcon,
  ShieldIcon,
  SwordIcon,
  SwordsIcon,
  WandSparklesIcon,
  type LucideIcon,
} from 'lucide-react'
import { ROLE_FILTERS } from '@/lib/roles'
import { cn } from '@/lib/utils'
import type { RoleFilter } from '@/types'

const ROLE_ICONS: Record<RoleFilter, LucideIcon> = {
  Semua: LayoutGridIcon,
  Tank: ShieldIcon,
  Fighter: SwordsIcon,
  Assassin: SwordIcon,
  Mage: WandSparklesIcon,
  Marksman: CrosshairIcon,
  Support: HeartPulseIcon,
}

type RoleChipsProps = {
  label: string
  value: RoleFilter
  onChange: (role: RoleFilter) => void
  className?: string
}

export const RoleChips = ({ label, value, onChange, className }: RoleChipsProps) => {
  return (
    <div role="group" aria-label={label} className={cn('flex flex-wrap gap-1.5', className)}>
      {ROLE_FILTERS.map((role) => {
        const Icon = ROLE_ICONS[role]
        const active = value === role
        return (
          <button
            key={role}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(role)}
            className={cn(
              'inline-flex min-h-11 cursor-pointer items-center gap-1.5 px-3.5 font-display text-[15px] font-semibold tracking-wide uppercase transition-colors clip-corners-sm',
              active
                ? 'bg-linear-to-b from-primary-hover to-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-input/60 hover:text-foreground',
            )}
          >
            <Icon aria-hidden className="size-4" />
            {role}
          </button>
        )
      })}
    </div>
  )
}
