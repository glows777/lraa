import { unstable_setRequestLocale } from 'next-intl/server'

import ToolTip from './_components/tooltip'

interface Props {
  params: { locale: string }
}

const Page = ({ params: { locale } }: Props) => {
  unstable_setRequestLocale(locale)
  return <ToolTip locale={locale} />
}

export default Page
