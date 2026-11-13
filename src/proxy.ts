import { NextResponse, type NextRequest } from 'next/server'
import { LOCALES, pickLocale } from '@/lib/i18n'

// Mengalihkan URL tanpa awalan bahasa (mis. "/") ke bahasa pilihan browser: "/id" atau "/en".
export const proxy = (request: NextRequest) => {
  const { pathname } = request.nextUrl
  const hasLocalePrefix = LOCALES.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  )
  if (hasLocalePrefix) return

  const locale = pickLocale(request.headers.get('accept-language'))
  request.nextUrl.pathname = `/${locale}${pathname === '/' ? '' : pathname}`
  return NextResponse.redirect(request.nextUrl)
}

export const config = {
  // Lewati file internal Next dan file statis (yang punya ekstensi).
  matcher: ['/((?!_next|.*\\..*).*)'],
}
