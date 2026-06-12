/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: undefined,
  typescript: {
    ignoreBuildErrors: false,
  },
  images: { unoptimized: true },
};

module.exports = nextConfig;