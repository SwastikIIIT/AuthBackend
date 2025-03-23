/** @type {import('@/models/node_modules/next').NextConfig} */
const nextConfig = {
   experimental: {
    appDir: true,
    serverComponentsExternalPackages: ["mongoose"],
    staticPageGenerationTimeout: 0,
  },
  reactStrictMode: true,
  webpack(config) {
    config.experiments = {
      ...config.experiments,
      topLevelAwait: true,
    };
    return config;
  },
};

export default nextConfig;
