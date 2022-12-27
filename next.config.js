/** @type {import('next').NextConfig} */
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig = {
  reactStrictMode: true,
  experimental: {
    swcPlugins: [['next-superjson-plugin', {}]],
  },
  transpilePackages: ['antd'],
  output: 'standalone',
  swcMinify: true,
};

module.exports = withBundleAnalyzer(nextConfig);
