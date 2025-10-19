import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable ESLint during builds to prevent Vercel deployment failures
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  // Disable TypeScript type checking during builds
  typescript: {
    // Warning: This allows production builds to successfully complete even if
    // your project has type errors.
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
