import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // ignore ESLint errors during Vercel build
  },
};

export default nextConfig;
