import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  /**
   * Vercel serverless traces only files the bundler sees. Knowledge files are read at
   * runtime via fs from `src/knowledge` — include them explicitly so production matches local.
   */
  outputFileTracingIncludes: {
    "/api/message-generator": ["./src/knowledge/**/*"],
  },
};

export default nextConfig;
