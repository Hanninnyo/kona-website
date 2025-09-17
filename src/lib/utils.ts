import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount)
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
}

export function formatTime(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(date)
}

export function generateOrderId(): string {
  return `KIC-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function isBusinessOpen(hours: { open: string; close: string }): boolean {
  const now = new Date()
  const currentTime = now.getHours() * 60 + now.getMinutes()

  const [openHour, openMin] = hours.open.split(':').map(Number)
  const [closeHour, closeMin] = hours.close.split(':').map(Number)

  const openTime = openHour * 60 + openMin
  const closeTime = closeHour * 60 + closeMin

  if (closeTime > openTime) {
    return currentTime >= openTime && currentTime <= closeTime
  } else {
    // Handle overnight hours
    return currentTime >= openTime || currentTime <= closeTime
  }
}

export function getHawaiianGreeting(): string {
  const hour = new Date().getHours()

  if (hour < 12) {
    return "Aloha kakahiaka" // Good morning
  } else if (hour < 17) {
    return "Aloha awakea" // Good afternoon
  } else {
    return "Aloha ahiahi" // Good evening
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout)
    }

    timeout = setTimeout(() => {
      func(...args)
    }, wait)
  }
}