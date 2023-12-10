import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import { cn } from '@/lib/utils'
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
      <body className={cn(' min-h-screen font-sans antialiased grainy', inter.className)}>{children}</body>
    </html>
  )
}
