import { ROLE_STYLES } from '@/lib/roles'
import { cn, getInitials } from '@/lib/utils'
import type { Hero } from '@/types'

type HeroAvatarProps = {
  hero: Hero
  className?: string
}

// Avatar inisial berwarna sesuai role utama hero.
export const HeroAvatar = ({ hero, className }: HeroAvatarProps) => {
  return (
    <span
      aria-hidden
      className={cn(
        'inline-flex size-10 shrink-0 items-center justify-center rounded-full border-2 text-sm font-bold',
        ROLE_STYLES[hero.roles[0]],
        className,
      )}
    >
      {getInitials(hero.name)}
    </span>
  )
}
