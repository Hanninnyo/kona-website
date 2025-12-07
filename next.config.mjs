/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: { ignoreBuildErrors: true },

  // allow remote images (optional but harmless)
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/photo-**',
      },
    ],
  },

  async redirects() {
    return [
      { source: '/menu', destination: '/menu-preview', permanent: false },
      { source: '/order', destination: '/menu-preview', permanent: false },
      { source: '/checkout', destination: '/menu-preview', permanent: false },
      { source: '/track/:path*', destination: '/menu-preview', permanent: false },
    ];
  },
};

export default nextConfig;

