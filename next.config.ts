import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // experimental: {
  //   scrollRestoration: true,
  //   // serverActions: {
  //   //   bodySizeLimit: "10mb",
  //   // },
  // },
  // Disable static optimization for dynamic routes
  trailingSlash: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "unsplash.com",
      },
      {
        protocol: "https",
        hostname: "api.dicebear.com",
      },
      {
        protocol: "https",
        hostname: "**", // ✅ Accepts all HTTPS domains
      },
    ],
  },
};

export default nextConfig;
