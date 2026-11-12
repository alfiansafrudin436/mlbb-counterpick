import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

export const buttonVariants = cva(
  'inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-[10px] font-medium whitespace-nowrap transition-colors disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-[18px] [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-primary-foreground hover:bg-primary-hover',
        outline: 'border border-input text-muted-foreground hover:text-foreground',
        ghost: 'text-foreground hover:bg-muted',
      },
      size: {
        sm: 'h-9 px-3 text-sm',
        md: 'h-11 px-4 text-[15px]',
        icon: 'size-11',
      },
    },
    defaultVariants: {
      variant: 'outline',
      size: 'md',
    },
  },
)

type ButtonProps = React.ComponentProps<'button'> & VariantProps<typeof buttonVariants>

export const Button = ({ className, variant, size, type = 'button', ...props }: ButtonProps) => {
  return (
    <button type={type} className={cn(buttonVariants({ variant, size }), className)} {...props} />
  )
}
