import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs))
}

// "Yu Zhong" → "YZ", "Fanny" → "FA", "X.Borg" → "XB".
export const getInitials = (name: string) => {
  const words = name
    .replace(/[^A-Za-z ]/g, ' ')
    .split(' ')
    .filter(Boolean)
  const initials = words.length > 1 ? words[0][0] + words[1][0] : (words[0] ?? '').slice(0, 2)
  return initials.toUpperCase()
}
