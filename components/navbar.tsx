import {
  LoginLink,
  LogoutLink,
  RegisterLink,
} from '@kinde-oss/kinde-auth-nextjs/components'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { ArrowRight } from 'lucide-react'
import { getTranslations } from 'next-intl/server'

import { Link } from '@/app/navigation'
import MaxWidthWrapper from '@/components/max-width-wrapper'
import { buttonVariants } from '@/components/ui/button'


import MobileNav from './mobile-nav'
import ToggleLanguage from './toggle-language'

interface NavbarProps {
  locale: string
}

interface NavbarProps {
  locale: string
}

const Navbar = async ({ locale }: NavbarProps) => {
  const { getUser } = getKindeServerSession()
  const user = await getUser()

  const t = await getTranslations('navbar')

  return (
    <nav className=" sticky h-14 inset-x-0 top-0 z-30 w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg transition-all">
      <MaxWidthWrapper>
        <div className=" flex h-14 items-center justify-between border-b border-neutral-200">
          <Link href="/" className=" flex z-40 font-semibold">
            <span>lraa.</span>
          </Link>

          <MobileNav isAuth={!!user} />

          <div className=" hidden items-center space-x-4 sm:flex">
            <ToggleLanguage />
            {!user ? (
              <>
                <Link
                  href='/pricing'
                  className={buttonVariants({
                    variant: 'ghost',
                    size: 'sm',
                  })}
                >
                  {t('pricing')}
                </Link>
                <LoginLink
                  className={buttonVariants({
                    variant: 'ghost',
                    size: 'sm',
                  })}
                >
                  {t('signIn')}
                </LoginLink>
                <RegisterLink
                  className={buttonVariants({
                    size: 'sm',
                  })}
                >
                  {t('start')}
                  <ArrowRight className=" ml-1.5 h-5 w-5" />
                </RegisterLink>
              </>
            ) : (
              <>
                <Link
                  href="/dashboard"
                  className={buttonVariants({
                    variant: 'ghost',
                    size: 'sm',
                  })}
                >
                  {t('dashboard')}
                </Link>
                <LogoutLink
                  className={buttonVariants({
                    variant: 'destructive',
                    size: 'sm',
                  })}
                >
                  {t('signOut')}
                </LogoutLink>
              </>
            )}
          </div>
        </div>
      </MaxWidthWrapper>
    </nav>
  )
}

export default Navbar
