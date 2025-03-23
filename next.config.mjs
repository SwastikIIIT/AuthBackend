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
  cookies: {
  sessionToken: {
    name: `next-auth.session-token`,
    options: {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      secure: process.env.NODE_ENV === 'production'
    }
  }
}
};

export default nextConfig;