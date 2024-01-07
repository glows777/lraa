import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import 'react-loading-skeleton/dist/skeleton.css'
import 'simplebar-react/dist/simplebar.min.css'

import TRPCProvider from '@/components/providers/trpc-provider'
import { Toaster } from '@/components/ui/toaster'
import { cn } from '@/lib/utils'
import Navbar from '../components/navbar'
import './globals.css'

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
          <Toaster />
          <Navbar />
          {children}
        </body>
      </TRPCProvider>
    </html>
  )
}
