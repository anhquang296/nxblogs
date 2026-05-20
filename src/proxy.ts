import { NextRequest, NextResponse } from 'next/server'

const LOCALES = ['en', 'vi']
const DEFAULT_LOCALE = 'en'

const GEO_COOKIE_OPTIONS = { path: '/', maxAge: 3600, sameSite: 'lax' as const }

function setGeoCookies(response: NextResponse, request: NextRequest) {
  const city = request.headers.get('x-vercel-ip-city') || ''
  const region = request.headers.get('x-vercel-ip-country-region') || ''
  const country = request.headers.get('x-vercel-ip-country') || ''

  response.cookies.set('geo_city', city, GEO_COOKIE_OPTIONS)
  response.cookies.set('geo_region', region, GEO_COOKIE_OPTIONS)
  response.cookies.set('geo_country', country, GEO_COOKIE_OPTIONS)
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (/\.\w+$/.test(pathname) || pathname.startsWith('/tools')) {
    return NextResponse.next()
  }

  const pathnameHasLocale = LOCALES.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (pathnameHasLocale) {
    const response = NextResponse.next()
    setGeoCookies(response, request)
    return response
  }

  const locale = request.cookies.get('NEXT_LOCALE')?.value || DEFAULT_LOCALE
  const validLocale = LOCALES.includes(locale) ? locale : DEFAULT_LOCALE

  request.nextUrl.pathname = `/${validLocale}${pathname}`
  const response = NextResponse.rewrite(request.nextUrl)
  setGeoCookies(response, request)
  return response
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|icon.svg|apple-icon.png|manifest|_pagefind).*)',
  ],
}
