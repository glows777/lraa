import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { unstable_setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'

import { db } from '@/db'
import { redirect } from '@/app/navigation'
import ChatWrapper from './_components/chat-wrapper'
import PDFRenderer from './_components/pdf-renderer'
interface FileIdPageProps {
  params: {
    fileid: string,
    locale: string
  }
}

const Page: React.FC<FileIdPageProps> = async ({ params: { fileid, locale } }) => {
  unstable_setRequestLocale(locale)

  const { getUser } = getKindeServerSession()
  const user = await getUser()

  if (!user || !user.id) {
    // redirect(`/auth-callback?origin=dashboard/${fileid}`)
    redirect({
      pathname: '/auth-callback',
      query: {
        origin: `dashboard/${fileid}`,
      },
    })
  }

  const file = await db.file.findFirst({
    where: {
      id: fileid,
      userId: user!.id,
    },
  })

  if (!file) {
    notFound()
  }
  return (
    <div className=" flex-1 justify-between flex flex-col h-[calc(100vh-3.5rem)]">
      <div className=" mx-auto w-full max-w-8xl grow lg:flex xl:px-2">
        {/* left side -> pdf renderer */}
        <div className=" flex-1 xl:flex">
          <div className=" px-4 py-6 sm:px-6 lg:pl-8 xl:flex-1 xl:pl-6">
            <PDFRenderer url={file.url} />
          </div>
        </div>

        {/* right side -> chat wrapper */}
        <div className=" shrink-0 flex-[0.75] border-t border-gray-200 lg:w-96 lg:border-l lg:border-t-0">
          <ChatWrapper fileId={file.id} />
        </div>
      </div>
    </div>
  )
}

export default Page
