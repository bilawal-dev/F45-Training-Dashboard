import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['upload.wikimedia.org'],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
