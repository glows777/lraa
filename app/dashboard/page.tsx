import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/dist/types/server'
import { redirect } from 'next/navigation'

const Page = async () => {

  const { getUser } = getKindeServerSession()
  const user = await getUser()

  if (!user || !user.id) redirect('/auth-callback?origin=dashboard')

  return <div>page</div>
}

export default Page
