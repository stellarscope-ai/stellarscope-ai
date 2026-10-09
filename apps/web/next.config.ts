import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@stellarscope/shared",
    "@stellarscope/stellar-data",
    "@stellarscope/analytics",
    "@stellarscope/ai",
  ],
};

export default nextConfig;