import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/router'
import { trpc } from '../_trpc/client'

const Page = () => {

    const router = useRouter()
    const searchParams = useSearchParams()
    const origin = searchParams.get('origin')
    trpc.authCallback.useQuery(undefined, {
        onSuccess: (data) => {
            console.log(data)
            router.push(origin ? `/${origin}` : '/dashboard')
        },
    })

  return <div>auth callback</div>
}

export default Page
