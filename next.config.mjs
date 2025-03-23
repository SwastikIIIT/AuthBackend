/** @type {import('next').NextConfig} */
const nextConfig = {
   experimental: {
    appDir: true,
    serverExternalPackages: ["mongoose"],
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