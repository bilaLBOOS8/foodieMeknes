import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('fr-MA', {
    style: 'currency',
    currency: 'MAD',
  }).format(price)
}

export function generateOrderNumber(): string {
  const date = new Date()
  const dateStr = date.toISOString().slice(2, 10).replace(/-/g, '')
  const randomStr = Math.random().toString(36).substr(2, 4).toUpperCase()
  return `FM${dateStr}${randomStr}`
}

export function calculateCartTotal(items: any[]): number {
  return items.reduce((total, item) => total + item.subtotal, 0)
}

export function calculateItemExtras(customizations: Record<string, string>): number {
  const v = customizations['With fries'] ?? customizations['بطاطس']
  if (!v) return 0
  const lower = v.toLowerCase()
  return lower === 'yes' || v === 'نعم' ? 7 : 0
}

export function validatePhoneNumber(phone: string): boolean {
  const moroccanPhoneRegex = /^(\+212|0)([5-7]\d{8})$/
  return moroccanPhoneRegex.test(phone.replace(/\s/g, ''))
}

export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\s/g, '')
  if (cleaned.startsWith('+212')) {
    return cleaned
  }
  if (cleaned.startsWith('0')) {
    return '+212' + cleaned.slice(1)
  }
  return '+212' + cleaned
}

export function getImageUrl(prompt: string, size: 'square' | 'portrait_4_3' | 'landscape_16_9' = 'square'): string {
  const encodedPrompt = encodeURIComponent(prompt)
  return `https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=${encodedPrompt}&image_size=${size}`
}

export function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

export function getOrderStatusColor(status: string): string {
  const colors = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    preparing: 'bg-orange-100 text-orange-800',
    ready: 'bg-green-100 text-green-800',
    delivered: 'bg-gray-100 text-gray-800',
    cancelled: 'bg-red-100 text-red-800',
  }
  return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'
}

export function getOrderStatusText(status: string): string {
  const texts = {
    pending: 'En attente',
    confirmed: 'Confirmé',
    preparing: 'En préparation',
    ready: 'Prêt',
    delivered: 'Livré',
    cancelled: 'Annulé',
  }
  return texts[status as keyof typeof texts] || status
}