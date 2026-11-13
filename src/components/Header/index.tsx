import { SwordsIcon } from 'lucide-react'
import { SITE_DESCRIPTION } from '@/lib/site'

export const Header = () => {
  return (
    <header className="mx-auto flex w-full max-w-[1200px] items-center gap-4 px-4 pt-8 pb-3 sm:px-6">
      <span
        aria-hidden
        className="inline-flex size-14 shrink-0 items-center justify-center bg-linear-to-b from-primary-hover to-primary text-primary-foreground clip-corners-sm"
      >
        <SwordsIcon className="size-7" />
      </span>
      <div className="min-w-0">
        <h1 className="font-display text-[34px] leading-none font-bold tracking-wide uppercase sm:text-[42px]">
          <span className="bg-linear-to-b from-primary-hover to-primary bg-clip-text text-transparent">
            Counter Pick
          </span>{' '}
          <span className="text-foreground">MLBB</span>
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground sm:text-[15px]">{SITE_DESCRIPTION}</p>
      </div>
    </header>
  )
}
