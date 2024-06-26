'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

import { usePathname, useRouter } from '@/app/navigation'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'

enum Locale {
    ZH = 'zh',
    EN = 'en'
}

const ToggleLanguage = () => {
    const router = useRouter()
    const pathname = usePathname()
    const params = useParams()

    const [currentLocale, setCurrentLocale] = useState<Locale>(Locale.ZH)
    useEffect(() => {
        setCurrentLocale(params.locale as Locale)
    }, [params])

    const toggleLanguage = (locale: string) => {
        router.push({
            pathname: pathname,
            // * if you have query params, you can pass them here
            // * in this project, there is only one dynamic route param, so we can assert it as { fileid: string }
            params: params as { fileid: string },
        }, { locale })
    }
    return (
        <Select onValueChange={toggleLanguage} value={currentLocale}>
            <SelectTrigger className=" w-40">
                <SelectValue placeholder="简体中文" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value={Locale.ZH}>简体中文</SelectItem>
                <SelectItem value={Locale.EN}>English</SelectItem>
            </SelectContent>
        </Select>
    )
}

export default ToggleLanguage