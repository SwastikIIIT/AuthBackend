/** @type {import('next').NextConfig} */
const nextConfig = {
  // Updated from experimental.serverComponentsExternalPackages
  serverExternalPackages: ["mongoose"],
  
  // Keep React strict mode
  reactStrictMode: true,
  
  // Add timeout for static generation
  staticPageGenerationTimeout: 1000,
  
  // Keep your webpack config for top level await
  webpack(config) {
    config.experiments = {
      ...config.experiments,
      topLevelAwait: true,
    };
    return config;
  },
};

export default nextConfig;