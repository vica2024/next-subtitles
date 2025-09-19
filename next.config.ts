import type { NextConfig } from "next";


const nextConfig: NextConfig = {
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      issuer: /\.[jt]sx?$/, // 只处理 js/ts 文件中的 import
      use: ["@svgr/webpack"],
    });
    return config;
  },
};

export default nextConfig;
