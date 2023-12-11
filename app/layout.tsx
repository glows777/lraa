import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import { cn } from '@/lib/utils'
import './globals.css'
import Navbar from './(marketing)/_components/navbar'
import TRPCProvider from '@/components/providers/trpc-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'LRAA - literature reading ai assistant',
  description: 'a literature-reading-ai-assistant',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <TRPCProvider>
        <body
          className={cn(
            ' min-h-screen font-sans antialiased grainy',
            inter.className
          )}
        >
          {' '}
          <Navbar />
          {children}
        </body>
      </TRPCProvider>
    </html>
  )
}
