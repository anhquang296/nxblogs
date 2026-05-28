'use client'

import { GoogleAnalytics } from '@next/third-parties/google'
import { track } from '@vercel/analytics'
import { Analytics as AnalyticsVercel } from '@vercel/analytics/next'
import { SpeedInsights as SpeedInsightsVercel } from '@vercel/speed-insights/next'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

const PROXY_HOST = 'p.stopjustcoding.com'
const GA_ID = 'G-8R2R0EKFHF'

function getGeoCookies() {
  const cookies = Object.fromEntries(document.cookie.split('; ').map((c) => c.split('=')))

  return {
    city: decodeURIComponent(cookies.geo_city || ''),
    region: cookies.geo_region || '',
    country: cookies.geo_country || '',
  }
}

function useGeoTracker() {
  const pathname = usePathname()

  useEffect(() => {
    if (window.location.hostname === PROXY_HOST) return

    const geo = getGeoCookies()

    if (geo.country) {
      track('page_view_geo', {
        city: geo.city,
        region: geo.region,
        country: geo.country,
        path: pathname,
      })
    }
  }, [pathname])
}

export function Analytics() {
  useGeoTracker()

  const [loadGa, setLoadGa] = useState(false)

  useEffect(() => {
    setLoadGa(window.location.hostname !== PROXY_HOST)
  }, [])

  return (
    <>
      <AnalyticsVercel
        beforeSend={(event) => {
          if (new URL(event.url).hostname === PROXY_HOST) return null
          return event
        }}
      />
      <SpeedInsightsVercel
        beforeSend={(data) => {
          if (new URL(data.url).hostname === PROXY_HOST) return null
          return data
        }}
      />
      {loadGa && <GoogleAnalytics gaId={GA_ID} />}
    </>
  )
}
