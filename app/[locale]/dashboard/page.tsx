import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { unstable_setRequestLocale } from 'next-intl/server'

import { db } from '@/db'
import { redirect } from '@/app/navigation'

import Dashboard from './_components/dashboard'

interface Props {
  params: { locale: string }
}

const Page = async ({ params: { locale } }: Props) => {
  unstable_setRequestLocale(locale)
  const { getUser } = getKindeServerSession()
  const user = await getUser()

  if (!user || !user.id) {
    redirect({
      pathname: '/auth-callback',
      query: { origin: 'dashboard' },
    })
  }

  const dbUser = await db.user.findFirst({
    where: {
      id: user!.id,
    },
  })

  if (!dbUser) {
    redirect({
      pathname: '/auth-callback',
      query: { origin: 'dashboard' },
    })
  }

  return <Dashboard />
}

export default Page
