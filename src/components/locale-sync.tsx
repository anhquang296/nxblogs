'use client'

import { useEffect } from 'react'

export function LocaleSync() {
  useEffect(() => {
    const stored = localStorage.getItem('NEXT_LOCALE')

    if (stored) {
      const current = document.cookie
        .split('; ')
        .find((c) => c.startsWith('NEXT_LOCALE='))
        ?.split('=')[1]

      if (current !== stored) {
        document.cookie = `NEXT_LOCALE=${stored};path=/;max-age=31536000`

        window.location.reload()
      }
    }
  }, [])

  return null
}
