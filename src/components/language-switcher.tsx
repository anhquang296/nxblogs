'use client'

import { useCallback } from 'react'

const LOCALE_LABELS: Record<string, string> = {
  vi: '🇻🇳',
  en: '🇬🇧',
}

type Props = {
  currentLocale: string
}

export function LanguageSwitcher({ currentLocale }: Props) {
  const otherLocale = currentLocale === 'vi' ? 'en' : 'vi'

  const switchLocale = useCallback(() => {
    localStorage.setItem('NEXT_LOCALE', otherLocale)
    document.cookie = `NEXT_LOCALE=${otherLocale};path=/;max-age=31536000`
    window.location.reload()
  }, [otherLocale])

  return (
    <button
      onClick={switchLocale}
      className={`flex size-9 items-center justify-center cursor-pointer rounded-lg text-xl transition-all duration-200 hover:scale-110 active:scale-95 ${
        otherLocale === 'en'
          ? 'hover:bg-blue-500/15 dark:hover:bg-blue-400/20'
          : 'hover:bg-red-500/15 dark:hover:bg-red-400/20'
      }`}
      title={otherLocale === 'en' ? 'Switch to English' : 'Chuyển sang Tiếng Việt'}
    >
      {LOCALE_LABELS[otherLocale]}
    </button>
  )
}
