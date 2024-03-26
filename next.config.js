const createNextIntlPlugin = require('next-intl/plugin')
 
const withNextIntl = createNextIntlPlugin('./app/i18n.ts')

/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
        config.resolve.alias.canvas = false
        config.resolve.alias.encoding = false
        return config
    }
}

module.exports = withNextIntl(nextConfig)
