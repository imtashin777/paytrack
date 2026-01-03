/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // Disable in dev for better performance (causes double renders)
  images: {
    domains: ['images.unsplash.com', 'plus.unsplash.com', 'i.pravatar.cc'],
    // Allow data URLs for logo uploads
    remotePatterns: [],
  },
  // Suppress hydration warnings in development
  onDemandEntries: {
    maxInactiveAge: 60 * 1000, // Keep pages in memory longer
    pagesBufferLength: 5, // Buffer more pages
  },
  // Performance optimizations
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Optimize bundle size
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion', 'recharts', '@radix-ui/react-icons'],
  },
  // Performance optimizations
  poweredByHeader: false,
  compress: true,
};

export default nextConfig;

