import type { Metadata, Viewport } from 'next'
import { Geist, Rajdhani } from 'next/font/google'
import { Footer, Header } from '@/components'
import { SITE_DESCRIPTION, SITE_NAME, SITE_TAGLINE } from '@/lib/site'
import { Providers } from './providers'
import './globals.css'

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

export const metadata: Metadata = {
  title: {
    default: `${SITE_NAME} — ${SITE_TAGLINE}`,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
}

export const viewport: Viewport = {
  themeColor: '#060a17',
}

const RootLayout = ({ children }: LayoutProps<'/'>) => {
  return (
    <html lang="id" className={`${geistSans.variable} ${rajdhani.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <Providers>
          <Header />
          <main id="konten" className="flex-1">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}

export default RootLayout
