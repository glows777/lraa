import { unstable_setRequestLocale } from 'next-intl/server'
import { Suspense } from 'react'

import ToolTip from './_components/tooltip'

interface Props {
  params: { locale: string }
}

const Page = ({ params: { locale } }: Props) => {
  unstable_setRequestLocale(locale)
  return (
    <Suspense>
      <ToolTip locale={locale} />
    </Suspense>
  )
}

export default Page