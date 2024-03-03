'use client'

import { Loader2 } from 'lucide-react'
import { useSearchParams } from 'next/navigation'

import { useRouter, usePathname } from '@/app/navigation'

import { trpc } from '../../_trpc/client'

interface Props {
  locale: string
}

const Page = ({ locale }: Props) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  // const searchParams = usePathname()
  const origin = searchParams.get('origin')
  

  const data = trpc.authCallback.useQuery(undefined, {
    onSuccess: ({ success }) => {
      console.log('origin', origin)
      router.push(origin ? `/${origin}` as '/dashboard' : '/dashboard')
    },
    onError: (error) => {
      if (error.data?.code === 'UNAUTHORIZED') {
        router.push('/')
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
