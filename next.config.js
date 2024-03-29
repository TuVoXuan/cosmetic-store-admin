const path = require('path')

module.exports = {
  trailingSlash: true,
  reactStrictMode: false,
  env: {
    API_URL: process.env.API_URL
  },
  images: {
    domains: ['res.cloudinary.com']
  },
  experimental: {
    esmExternals: false,
    jsconfigPaths: true // enables it for both jsconfig.json and tsconfig.json
  },
  webpack: config => {
    config.resolve.alias = {
      ...config.resolve.alias,
      apexcharts: path.resolve(__dirname, './node_modules/apexcharts-clevision')
    }

    return config
  }
}
