import type { Metadata, Viewport } from 'next'
import { Geist, Rajdhani } from 'next/font/google'
import { notFound } from 'next/navigation'
import { Footer, Header } from '@/components'
import { hasLocale, LOCALES } from '@/lib/i18n'
import { SITE_NAME } from '@/lib/site'
import { getDictionary } from './dictionaries'
import { Providers } from './providers'
import '../globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

// Font judul bergaya esports.
const rajdhani = Rajdhani({
  variable: '--font-rajdhani',
  subsets: ['latin'],
  weight: ['600', '700'],
})

export const generateStaticParams = () => {
  return LOCALES.map((lang) => ({ lang }))
}

export const generateMetadata = async ({ params }: LayoutProps<'/[lang]'>): Promise<Metadata> => {
  const { lang } = await params
  if (!hasLocale(lang)) return {}
  const { site } = await getDictionary(lang)

  return {
    title: {
      default: `${SITE_NAME} — ${site.tagline}`,
      template: `%s · ${SITE_NAME}`,
    },
    description: site.description,
    applicationName: SITE_NAME,
    alternates: {
      languages: Object.fromEntries(LOCALES.map((locale) => [locale, `/${locale}`])),
    },
  }
}

export const viewport: Viewport = {
  themeColor: '#060a17',
}

const RootLayout = async ({ children, params }: LayoutProps<'/[lang]'>) => {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()
  const { site } = await getDictionary(lang)

  return (
    <html lang={lang} className={`${geistSans.variable} ${rajdhani.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <Providers>
          <Header locale={lang} description={site.description} languageLabel={site.language} />
          <main id="konten" className="flex-1">
            {children}
          </main>
          <Footer>{site.footer}</Footer>
        </Providers>
      </body>
    </html>
  )
}

export default RootLayout
