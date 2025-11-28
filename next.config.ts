import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["payload"],
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
        pathname: "/api/media/**",
      },
      {
        protocol: "https",
        hostname: "doma-backend-bgulcov4a-arooshimrans-projects.vercel.app",
        pathname: "/api/media/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "victorious-strength-82f631d95b.media.strapiapp.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      }
    ],
  },
};

export default nextConfig;
