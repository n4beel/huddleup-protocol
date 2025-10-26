import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com", // ✅ allows Google profile images
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true, // ✅ Skips ESLint during builds
  },
};

export default nextConfig;
