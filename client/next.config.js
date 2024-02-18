/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['*'],
  },
  env: {
    NEXT_PUBLIC_RAILWAY_KEY: process.env.NEXT_PUBLIC_RAILWAY_KEY,
  },
};

module.exports = nextConfig
