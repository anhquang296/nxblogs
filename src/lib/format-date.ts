export function formatDate(date: string | Date, lang: string = 'en'): string {
  if (!date) return null
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const locale = lang === 'vi' ? 'vi-VN' : 'en-US'

  return dateObj.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}
