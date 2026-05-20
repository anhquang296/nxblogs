'use client'

import { track } from '@vercel/analytics'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

function getGeoCookies() {
  const cookies = Object.fromEntries(document.cookie.split('; ').map((c) => c.split('=')))

  return {
    city: decodeURIComponent(cookies.geo_city || ''),
    region: cookies.geo_region || '',
    country: cookies.geo_country || '',
  }
}

export function GeoTracker() {
  const pathname = usePathname()

  useEffect(() => {
    const geo = getGeoCookies()
    if (!geo.country) return

    track('page_view_geo', {
      city: geo.city,
      region: geo.region,
      country: geo.country,
      path: pathname,
    })
  }, [pathname])

  return null
}
