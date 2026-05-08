'use client'

import { useTheme } from 'next-themes'
import { useMounted } from 'nextra/hooks'
import { MoonIcon } from './animated-icons/moon'
import { SunIcon } from './animated-icons/sun'

export function AnimatedThemeSwitch() {
  const { setTheme, resolvedTheme } = useTheme()
  const mounted = useMounted()
  const isDark = mounted && resolvedTheme === 'dark'

  return (
    <button
      aria-label="Toggle Dark Mode"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="flex size-9 cursor-pointer items-center justify-center rounded-lg transition-all duration-200 hover:scale-110 active:scale-95 hover:bg-gray-500/15 dark:hover:bg-gray-400/20"
    >
      {isDark ? <MoonIcon size={20} /> : <SunIcon size={20} />}
    </button>
  )
}
