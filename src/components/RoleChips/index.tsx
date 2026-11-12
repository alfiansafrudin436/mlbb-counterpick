import { ROLE_FILTERS } from '@/lib/roles'
import { cn } from '@/lib/utils'
import type { RoleFilter } from '@/types'

type RoleChipsProps = {
  label: string
  value: RoleFilter
  onChange: (role: RoleFilter) => void
  className?: string
}

export const RoleChips = ({ label, value, onChange, className }: RoleChipsProps) => {
  return (
    <div role="group" aria-label={label} className={cn('flex flex-wrap gap-1.5', className)}>
      {ROLE_FILTERS.map((role) => (
        <button
          key={role}
          type="button"
          aria-pressed={value === role}
          onClick={() => onChange(role)}
          className={cn(
            'min-h-11 cursor-pointer rounded-full border px-3.5 text-[13px] transition-colors',
            value === role
              ? 'border-primary bg-primary font-semibold text-primary-foreground'
              : 'text-muted-foreground hover:text-foreground',
          )}
        >
          {role}
        </button>
      ))}
    </div>
  )
}
