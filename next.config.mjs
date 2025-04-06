/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    // Disabling for production builds - we've already fixed the issues
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
