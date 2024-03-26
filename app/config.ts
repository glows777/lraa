import { Pathnames } from 'next-intl/navigation'

export const locales = ['en', 'zh'] as const

export const pathnames = {
    '/': '/',
    '/pricing': '/pricing',
    '/dashboard': '/dashboard',
    '/auth-callback': '/auth-callback',
    '/dashboard/[fileid]': '/dashboard/[fileid]',
} satisfies Pathnames<typeof locales>

// Use the default: `always`
export const localePrefix = 'always' as const

export type AppPathnames = keyof typeof pathnames