type FooterProps = {
  children: React.ReactNode
}

export const Footer = ({ children }: FooterProps) => {
  return (
    <footer className="mx-auto w-full max-w-[1200px] px-4 pb-8 text-xs text-muted-foreground sm:px-6">
      {children}
    </footer>
  )
}
