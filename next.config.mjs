/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
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
