import { notFound } from 'next/navigation'
import { getRequestConfig } from 'next-intl/server'
import { json } from 'stream/consumers'

// Can be imported from a shared config
const locales = ['en', 'zh']

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) notFound()

  const url = `https://api.i18nexus.com/project_resources/translations/${locale}.json?api_key=${process.env.I18NEXUS_API_KEY}`
  const res = await fetch(url, {
    next: { revalidate: false }
  })
  const messages = await res.json()

  return {
    messages: (await import(`../messages/${locale}.json`)).default,
  }
  // return {
  //   messages
  // }
})