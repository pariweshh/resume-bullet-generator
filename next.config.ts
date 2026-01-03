import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  /* config options here */

  cacheComponents: true,

  // reactCompiler: true,

  images: {
    minimumCacheTTL: 14400,
    qualities: [75],
    remotePatterns: [],
  },

  env: {
    NEXT_PUBLIC_APP_URL:
      process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  },

  // Headers for security
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
        ],
      },
    ]
  },
}

export default nextConfig
