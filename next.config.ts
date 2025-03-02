import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "export",
  basePath: process.env.NEXT_PUBLIC_URL_PATH,
  images: { unoptimized: true }
};

export default nextConfig;
