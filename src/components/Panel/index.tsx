import { cva, type VariantProps } from 'class-variance-authority'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

// Bingkai gradasi 1px + sudut terpotong; `tone` menentukan warna bingkai dan ikon.
const frameVariants = cva('clip-corners min-w-0 bg-linear-to-b via-border to-border p-px', {
  variants: {
    tone: {
      gold: 'from-primary/80',
      danger: 'from-danger/80',
    },
  },
  defaultVariants: {
    tone: 'gold',
  },
})

const iconVariants = cva('size-5 shrink-0', {
  variants: {
    tone: {
      gold: 'text-primary',
      danger: 'text-danger',
    },
  },
  defaultVariants: {
    tone: 'gold',
  },
})

type PanelProps = VariantProps<typeof frameVariants> & {
  id: string
  title: string
  icon: LucideIcon
  // Konten di sisi kanan judul (penghitung, tombol).
  aside?: React.ReactNode
  children: React.ReactNode
  className?: string
}

export const Panel = ({ id, title, icon: Icon, tone, aside, children, className }: PanelProps) => {
  return (
    <section aria-labelledby={id} className={cn(frameVariants({ tone }), className)}>
      <div className="h-full bg-card p-4 clip-corners sm:p-5">
        <div className="mb-4 flex min-h-11 items-center justify-between gap-3">
          <h2
            id={id}
            className="flex items-center gap-2 font-display text-xl font-bold tracking-wider uppercase"
          >
            <Icon aria-hidden className={iconVariants({ tone })} />
            {title}
          </h2>
          {aside}
        </div>
        {children}
      </div>
    </section>
  )
}
