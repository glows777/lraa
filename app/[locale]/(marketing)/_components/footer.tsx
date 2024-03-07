import { useTranslations } from 'next-intl'

import { Link } from '@/app/navigation'

import BorderImage from './border-image'

const Footer = () => {
  const t = useTranslations('landing-page')
  return (
    <div className=" mx-auto mb-32 mt-32 max-w-5xl sm:mt-56">
      <div className=" mb-12 px-6 lg:px-8">
        <div className=" mx-auto max-w-2xl sm:text-center">
          <h2 className=" mt-2 font-bold text-4xl text-gray-900 sm:text-5xl">
            {t('footer-title')}
          </h2>
          <p className=" mt-4 text-lg text-gray-600">
            {t('footer-description')}
          </p>
        </div>
      </div>

      <ol className=" my-8 space-y-4 pt-8 md:flex md:space-x-12 md:space-y-0">
        <li className=" md:flex-1">
          <div className=" flex flex-col space-y-2 border-l-4 border-neutral-300 py-2 pl-4 md:border-l-0 md:border-t-2 md:pb-0 md:pl-0 md:pt-4">
            <span className=" text-sm font-medium text-blue-600">{t('footer-step1')}</span>
            <span className=" text-xl font-semibold">
              {t('footer-step1-1')}
            </span>
            <span className=" mt-2 text-neutral-700">
              {t('footer-step1-2')}
              <Link
                href="/pricing"
                className=" text-blue-700 underline underline-offset-2"
              >
                {t('footer-step1-3')}
              </Link>
              .
            </span>
          </div>
        </li>
        <li className=" md:flex-1">
          <div className=" flex flex-col space-y-2 border-l-4 border-neutral-300 py-2 pl-4 md:border-l-0 md:border-t-2 md:pb-0 md:pl-0 md:pt-4">
            <span className=" text-sm font-medium text-blue-600">{t('footer-step2')}</span>
            <span className=" text-xl font-semibold">{t('footer-step2-1')}</span>
            <span className=" mt-2 text-neutral-700">
              {t('footer-step2-2')}
            </span>
          </div>
        </li>
        <li className=" md:flex-1">
          <div className=" flex flex-col space-y-2 border-l-4 border-neutral-300 py-2 pl-4 md:border-l-0 md:border-t-2 md:pb-0 md:pl-0 md:pt-4">
            <span className=" text-sm font-medium text-blue-600">{t('footer-step3')}</span>
            <span className=" text-xl font-semibold">
              {t('footer-step3-1')}
            </span>
            <span className=" mt-2 text-neutral-700">
              {
                t('footer-step3-2')
              }
            </span>
          </div>
        </li>
      </ol>
      <BorderImage
        src="/file-upload-preview.jpg"
        alt="uploading preview"
        width={1419}
        height={732}
        quality={100}
      />
    </div>
  )
}

export default Footer
