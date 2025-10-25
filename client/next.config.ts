import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true, // ✅ Skips ESLint during builds
  },
};

export default nextConfig;
