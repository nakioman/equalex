/** @type {import('next').NextConfig} */
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig = {
  reactStrictMode: true,
  experimental: {
    swcPlugins: [['next-superjson-plugin', {}]],
  },
  output: 'standalone',
  swcMinify: true,
  staticPageGenerationTimeout: 300,
};

module.exports = withBundleAnalyzer(nextConfig);
