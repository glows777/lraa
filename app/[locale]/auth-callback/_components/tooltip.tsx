'use client'

import { Loader2, Undo2 } from 'lucide-react'
import { useSearchParams } from 'next/navigation'

import { useRouter } from '@/app/navigation'

import { trpc } from '../../../_trpc/client'
import { Button } from '@/components/ui/button'

const ToolTip = ({ locale }: { locale: string }) => {
    const router = useRouter()
    const searchParams = useSearchParams()
    const origin = searchParams.get('origin')

    const data = trpc.authCallback.useQuery(undefined, {
        onSuccess: ({ success, user }) => {
            console.log('success', success, user)
            // router.push(origin ? `/${origin}` as '/dashboard' : '/dashboard')
        },
        onError: (error) => {
            if (error.data?.code === 'UNAUTHORIZED') {
                router.push('/')
            }
        },
        retry: false,
        retryDelay: 500,
    })

    return (
        <div className=' w-ful mt-24 flex justify-center'>
            <div className=' flex flex-col items-center gap-2'>
                {
                    data.isSuccess ? (
                        <>
                            <h3 className=' font-semibold text-xl'>Successfully setting up!</h3>
                            <Button onClick={() => router.push(origin ? `/${origin}` as '/dashboard' : '/dashboard')}>
                                <Undo2 className=' h-4 w-4 mr-2' />
                                back
                            </Button>
                        </>
                    ) : (
                        <>
                            <Loader2 className=" h-8 w-8 animate-spin text-neutral-800" />
                            <h3 className=' font-semibold text-xl'>Setting up to your account...</h3>
                            {/* <p>you will be redirect automatically.</p> */}
                        </>
                    )
                }
            </div>
        </div>
    )
}

export default ToolTip