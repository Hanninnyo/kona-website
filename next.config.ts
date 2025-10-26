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
