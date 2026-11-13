import { LanguagesIcon } from 'lucide-react'
import Link from 'next/link'
import { LOCALE_LABELS, LOCALES } from '@/lib/i18n'
import { cn } from '@/lib/utils'
import type { Locale } from '@/types'

type LanguageSwitcherProps = {
  locale: Locale
  label: string
  className?: string
}

export const LanguageSwitcher = ({ locale, label, className }: LanguageSwitcherProps) => {
  return (
    <nav aria-label={label} className={cn('flex items-center gap-1.5', className)}>
      <LanguagesIcon aria-hidden className="size-[18px] text-muted-foreground" />
      {LOCALES.map((item) => {
        const active = item === locale
        return (
          <Link
            key={item}
            href={`/${item}`}
            hrefLang={item}
            lang={item}
            aria-current={active ? 'page' : undefined}
            title={LOCALE_LABELS[item]}
            className={cn(
              'inline-flex min-h-11 min-w-11 items-center justify-center px-3 font-display text-[15px] font-bold tracking-wide uppercase transition-colors clip-corners-sm',
              active
                ? 'bg-linear-to-b from-primary-hover to-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-input/60 hover:text-foreground',
            )}
          >
            <span aria-hidden>{item}</span>
            <span className="sr-only">{LOCALE_LABELS[item]}</span>
          </Link>
        )
      })}
    </nav>
  )
}
