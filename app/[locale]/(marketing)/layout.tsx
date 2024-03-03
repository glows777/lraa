import { unstable_setRequestLocale } from 'next-intl/server'

export default function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  unstable_setRequestLocale(locale)
  return (
    children
  )
}
