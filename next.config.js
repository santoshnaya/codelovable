/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost']
  },
  env: {
    ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY || ''
  }
}

module.exports = nextConfig