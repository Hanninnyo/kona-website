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
