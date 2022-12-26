/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    swcPlugins: [['next-superjson-plugin', {}]],
  },
  output: 'standalone',
  swcMinify: true,
};

module.exports = nextConfig;
