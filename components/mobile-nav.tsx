'use client'

import {
  LoginLink,
  LogoutLink,
  RegisterLink,
} from '@kinde-oss/kinde-auth-nextjs/components'
import { ArrowRight, Menu } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

import { cn } from '@/lib/utils'
import { Link } from '@/app/navigation'

import { buttonVariants } from './ui/button'

const MobileNav = ({ isAuth }: { isAuth: boolean }) => {
  const [isOpen, setOpen] = useState<boolean>(false)
  const t = useTranslations('navbar')

  const toggleOpen = () => setOpen((prev) => !prev)

  const pathname = usePathname()

  useEffect(() => {
    if (isOpen) toggleOpen()
  }, [pathname])

  const closeOnCurrent = (href: string) => {
    if (pathname === href) {
      toggleOpen()
    }
  }

  return (
    <div className=" sm:hidden">
      <Menu
        onClick={toggleOpen}
        className=" relative z-50 h-5 w-5 text-neutral-700"
      />

      {isOpen ? (
        <div className=" fixed animate-in slide-in-from-top-5 fade-in-20 inset-0 z-0 w-full">
          <ul className=" absolute bg-white border-b border-neutral-200 shadow-xl grid w-full gap-3 px-10 pt-20 pb-8">
            {!isAuth ? (
              <>
                <li>
                  <RegisterLink
                    className={cn(
                      buttonVariants({
                        variant: 'ghost',
                        size: 'sm',
                      }),
                      ' font-semibold px-0 text-green-600 bg-inherit text-md'
                    )}
                  >
                    {t('start')}
                    <ArrowRight className=" ml-2 h-5 w-5" />
                  </RegisterLink>
                </li>
                <li className=" my-3 h-px w-full bg-gray-300" />
                <li>
                  <LoginLink
                    className={cn(
                      buttonVariants({
                        variant: 'ghost',
                        size: 'sm',
                      }),
                      ' font-semibold px-0 text-md'
                    )}
                  >
                    {t('signIn')}
                  </LoginLink>
                </li>
                <li className=" my-3 h-px w-full bg-gray-300" />
                <li>
                  <Link
                    onClick={() => closeOnCurrent('/pricing')}
                    className=" flex items-center w-full font-semibold text-md"
                    href="/pricing"
                  >
                    {t('pricing')}
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    onClick={() => closeOnCurrent('/dashboard')}
                    className=" flex items-center w-full font-semibold text-md"
                    href="/dashboard"
                  >
                    {t('dashboard')}
                  </Link>
                </li>
                <li className=" my-3 h-px w-full bg-gray-300" />
                <li>
                  <LogoutLink
                    className={cn(
                      buttonVariants({
                        variant: 'ghost',
                        size: 'sm',
                      }),
                      ' font-semibold px-0 text-md'
                    )}
                  >
                    {t('signOut')}
                  </LogoutLink>
                </li>
              </>
            )}
          </ul>
        </div>
      ) : null}
    </div>
  )
}

export default MobileNav
