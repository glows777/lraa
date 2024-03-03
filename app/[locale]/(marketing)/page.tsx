import { unstable_setRequestLocale } from 'next-intl/server'

import Header from './_components/header'
import Intro from './_components/intro'
import Footer from './_components/footer'

export default function Home({ params: { locale } }: { params: { locale: string } }) {
  unstable_setRequestLocale(locale)
  return (
    <>
      <Header />
      <Intro />
      <Footer />
    </>
  )
}
