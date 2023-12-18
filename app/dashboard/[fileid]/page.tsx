import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { notFound, redirect } from 'next/navigation'

import { db } from '@/db'

interface FileIdPageProps {
  params: {
    fileid: string
  }
}

const FileIdPage: React.FC<FileIdPageProps> = async ({ params }) => {
  const { fileid } = params

  const { getUser } = getKindeServerSession()
  const user = await getUser()

  if (!user || !user.id) {
    redirect(`/auth-callback?origin=dashboard/${fileid}`)
  }

  const file = db.file.findFirst({
    where: {
      id: fileid,
      userId: user.id,
    },
  })

  if (!file) {
    notFound()
  }
  return (
    <div className=' flex-1 justify-between flex flex-col h-[calc(100vh - 3.5rem)]'>
      <div className=' mx-auto w-full max-w-8xl grow lg:flex xl:px-2'>
        {/* left side -> pdf renderer */}
        <div className=' flex-1 xl:flex'>
            <div className=' px-4 py-6 sm:px-6 lg:pl-8 xl:flex-1 xl:pl-6'>
                pdfRenderer
            </div>
        </div>

        {/* right side -> chat wrapper */}
        <div className=' shrink-0 flex-[0.75] border-t border-gray-200 lg:w-96 lg:border-l lg:border-t-0'>
            chat wrapper
        </div>
      </div>
    </div>
  )
}

export default FileIdPage
