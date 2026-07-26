import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "**",
      },

      {
        protocol: "https",
        hostname: "pub-a770e4f20081446d8915b1fdd3a1c49a.r2.dev",
        pathname: "**",
      },
    ],
  },
};

export default nextConfig;
