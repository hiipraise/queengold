/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["mongoose"],
  },
  images: {
    // Add your CDN / image hosting domains here
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn.queengold.com",
        pathname: "/**",
      },
    ],
    // Allow local /public images
    unoptimized: process.env.NODE_ENV === "development",
  },
  // Security headers
  async headers() {
    return [
      {
        source: "/api/payments/squad/webhook",
        headers: [
          { key: "Cache-Control", value: "no-store" },
        ],
      },
    ];
  },
};

export default nextConfig;
