import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  serverExternalPackages: ['puppeteer'],
  // Isolate the e2e dev server's build output so it never contends with a
  // separately running `npm run dev` over the shared .next/cache.
  distDir: process.env.E2E_FIXTURES === '1' ? '.next-e2e' : '.next'
}

export default nextConfig
