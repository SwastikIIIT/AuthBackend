/** @type {import('next').NextConfig} */
const nextConfig = {
   experimental: {
    appDir: true,
    serverComponentsExternalPackages: ["mongoose"],
    staticPageGenerationTimeout: 0,
  },
  webpack(config) {
    config.experiments = {
      ...config.experiments,
      topLevelAwait: true,
    };
    return config;
  },
};

export default nextConfig;
