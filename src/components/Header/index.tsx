import { SITE_DESCRIPTION } from '@/lib/site'

export const Header = () => {
  return (
    <header className="mx-auto w-full max-w-[1200px] px-4 pt-7 pb-2 sm:px-6">
      <h1 className="text-[28px] font-bold tracking-tight">
        Counter Pick <span className="text-primary">MLBB</span>
      </h1>
      <p className="mt-1 text-muted-foreground">{SITE_DESCRIPTION}</p>
    </header>
  )
}
