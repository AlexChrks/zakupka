import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency = 'BYN'): string {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency,
  }).format(amount)
}

export function formatDate(date: Date | string, options?: Intl.DateTimeFormatOptions): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('ru-RU', {
    dateStyle: 'medium',
    ...options,
  }).format(d)
}

export function formatRelativeDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diffInMs = d.getTime() - now.getTime()
  const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24))

  if (diffInDays < 0) {
    const absDays = Math.abs(diffInDays)
    if (absDays === 1) return 'Вчера'
    return `${absDays} дн. назад`
  } else if (diffInDays === 0) {
    return 'Сегодня'
  } else if (diffInDays === 1) {
    return 'Завтра'
  } else if (diffInDays <= 7) {
    return `Через ${diffInDays} дн.`
  } else {
    return formatDate(d)
  }
}
