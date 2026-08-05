import type { Metadata, Viewport } from 'next'
import AppBar, { AppBarSkeleton } from '@/components/app-bar'
import Providers from '@/components/providers'
import { publicUrl } from '@/config'
import { robotoFlex, robotoMono } from '@/theme/fonts'
import { Suspense } from 'react'

export const metadata: Metadata = {
  title: {
    default: 'melchor9000.me',
    template: '%s - melchor9000.me',
  },
  description: 'Webpage of melchor9000/melchor629',
  metadataBase: publicUrl,
  openGraph: {
    title: {
      default: 'melchor9000.me',
      template: '%s - melchor9000.me',
    },
    description: 'Webpage of melchor9000/melchor629',
    type: 'website',
    siteName: 'melchor9000.me',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({ children }: React.PropsWithChildren) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${robotoFlex.variable} ${robotoMono.variable}`}>
        <Providers>
          <Suspense fallback={<AppBarSkeleton />}>
            <AppBar />
          </Suspense>
          <div role="presentation" style={{ minHeight: 'calc(100lvh - 48px)' }}>
            {children}
          </div>
        </Providers>
      </body>
    </html>
  )
}
