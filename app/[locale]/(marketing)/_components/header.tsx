import { ArrowRight } from 'lucide-react'
import { useTranslations } from 'next-intl'

import MaxWidthWrapper from '@/components/max-width-wrapper'
import { buttonVariants } from '@/components/ui/button'
import { Link } from '@/app/navigation'

const Header = () => {
  const t = useTranslations('landing-page')
  return (
    <MaxWidthWrapper className=" mb-12 mt-28 sm:mt-40 flex flex-col items-center justify-center text-center">
      <div
        className=" mx-auto mb-4 flex max-w-fit items-center justify-center
      space-x-2 overflow-hidden rounded-full border border-gray-200 bg-white px-7 py-2 shadow-md
      backdrop-blur transition-all hover:border-gray-300 hover:bg-white/50"
      >
        <p className=" text-sm font-semibold text-gray-700">
          {t('header-public')}
        </p>
      </div>
      <h1 className=" max-w-4xl text-5xl font-bold md:text-6xl lg:text-7xl">
        {t('header-slogan1')} <span className=" text-blue-600">{t('header-slogan2')}</span> {t('header-slogan3')}
      </h1>
      <p className=" mt-5 max-w-prose text-neutral-700 sm:text-lg">
        {t('header-description')}
      </p>
      <Link
        className={buttonVariants({
          size: 'lg',
          className: ' mt-5',
        })}
        href="/dashboard"
        target="_blank"
      >
        {t('header-start')}
        <ArrowRight className=" ml-2 h-5 w-5" />
      </Link>
    </MaxWidthWrapper>
  )
}

export default Header
