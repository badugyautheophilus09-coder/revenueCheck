import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // PWA configuration will be handled manually with service worker
  // next-pwa has compatibility issues with newer Next.js versions
  allowedDevOrigins: ['127.0.0.1'],
};

export default nextConfig;
