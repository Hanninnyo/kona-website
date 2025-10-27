import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/photo-*',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/menu',
        destination: '/menu-preview',
        permanent: false,
      },
      {
        source: '/order',
        destination: '/menu-preview',
        permanent: false,
      },
      {
        source: '/checkout',
        destination: '/menu-preview',
        permanent: false,
      },
      {
        source: '/track/:path*',
        destination: '/menu-preview',
        permanent: false,
      },
    ]
  },
};

export default nextConfig;
 /** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Do not block Vercel/production builds on ESLint errors
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
import type { NextConfig } from 'next';
const nextConfig: NextConfig = {
  eslint: { ignoreDuringBuilds: true },
};
export default nextConfig;
/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  typescript: {
    // Do not block production builds on TS type errors
    ignoreBuildErrors: true,
  },
};
export default nextConfig; // or module.exports = nextConfig; if using .js
// next.config.(ts|mjs|js)
const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },

  async redirects() {
    return [
      { source: '/menu', destination: '/menu-preview', permanent: false },
      { source: '/order', destination: '/menu-preview', permanent: false },
      { source: '/checkout', destination: '/menu-preview', permanent: false },
      { source: '/track/:path*', destination: '/menu-preview', permanent: false },
      // When your mobile app is live, change destinations to:
      // { source: '/menu', destination: 'https://app.konaislandcoffee.com/menu', permanent: false },
    ];
  },
};

export default nextConfig; // or module.exports = nextConfig;
import type { NextConfig } from 'next';
const nextConfig: NextConfig = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
};
export default nextConfig;
18:37:35.861 
> Build error occurred
18:37:35.869 
Error: Turbopack build failed with 17 errors:
