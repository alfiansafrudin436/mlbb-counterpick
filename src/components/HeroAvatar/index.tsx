'use client'

import Image from 'next/image'
import { useState } from 'react'
import { ROLE_STYLES } from '@/lib/roles'
import { cn, getInitials } from '@/lib/utils'
import type { Hero } from '@/types'

type HeroAvatarProps = {
  hero: Hero
  className?: string
}

// Potret hero dengan bingkai berwarna sesuai role utama; jatuh ke inisial bila gambar tidak ada.
export const HeroAvatar = ({ hero, className }: HeroAvatarProps) => {
  const [failed, setFailed] = useState(false)
  const showImage = Boolean(hero.image) && !failed

  return (
    <span
      aria-hidden
      className={cn(
        'inline-flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 text-sm font-bold',
        ROLE_STYLES[hero.roles[0]],
        className,
      )}
    >
      {showImage ? (
        <Image
          src={hero.image!}
          alt=""
          width={40}
          height={40}
          className="size-full object-cover"
          onError={() => setFailed(true)}
        />
      ) : (
        getInitials(hero.name)
      )}
    </span>
  )
}
