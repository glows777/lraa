'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { trpc } from '../_trpc/client'
import { Loader2 } from 'lucide-react'

const Page = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const origin = searchParams.get('origin')

  trpc.authCallback.useQuery(undefined, {
    onSuccess: ({ success }) => {
      router.push(origin ? `/${origin}` : '/dashboard')
    },
    onError: (error) => {
      if (error.data?.code === 'UNAUTHORIZED') {
        router.push('/sign-in')
      }
    },
    retry: true,
    retryDelay: 500,
  })

  return (
    <div className=' w-ful mt-24 flex justify-center'>
      <div className=' flex flex-col items-center gap-2'>
        <Loader2 className=" h-8 w-8 animate-spin text-neutral-800" />
        <h3 className=' font-semibold text-xl'>Setting up to your account...</h3>
        <p>you will be redirect automatically.</p>
      </div>
    </div>
  )
}

export default Page
