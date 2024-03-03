import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import 'react-loading-skeleton/dist/skeleton.css'
import 'simplebar-react/dist/simplebar.min.css'
import {unstable_setRequestLocale} from 'next-intl/server'

import TRPCProvider from '@/components/providers/trpc-provider'
import { Toaster } from '@/components/ui/toaster'
import { cn } from '@/lib/utils'
import Navbar from '../../components/navbar'
import './globals.css'

const locales = ['en', 'zh']
 
export function generateStaticParams() {
  return locales.map((locale) => ({locale}))
}

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'LRAA - literature reading ai assistant',
  description: 'a literature-reading-ai-assistant',
}

export default function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  unstable_setRequestLocale(locale)
  return (
    <html lang={locale}>
      <TRPCProvider>
        <body
          className={cn(
            ' min-h-screen font-sans antialiased grainy',
            inter.className
          )}
        >
          <Toaster />
          <Navbar locale={locale} />
          {children}
        </body>
      </TRPCProvider>
    </html>
  )
}
