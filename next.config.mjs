/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // Disable in dev for better performance (causes double renders)
  images: {
    domains: ['images.unsplash.com', 'plus.unsplash.com', 'i.pravatar.cc'],
    // Allow data URLs for logo uploads
    remotePatterns: [],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
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
    optimizePackageImports: [
      'lucide-react', 
      'framer-motion', 
      'recharts', 
      '@radix-ui/react-icons',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-select',
      '@radix-ui/react-avatar',
      '@radix-ui/react-tooltip',
    ],
    // Optimize CSS (disabled - requires critters package)
    // optimizeCss: true,
  },
  // Performance optimizations
  poweredByHeader: false,
  compress: true,
  // Optimize output
  output: 'standalone',
  // Reduce JavaScript bundle size
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            default: false,
            vendors: false,
            // Vendor chunk
            vendor: {
              name: 'vendor',
              chunks: 'all',
              test: /node_modules/,
              priority: 20,
            },
            // Common chunk
            common: {
              name: 'common',
              minChunks: 2,
              chunks: 'all',
              priority: 10,
              reuseExistingChunk: true,
              enforce: true,
            },
          },
        },
      }
    }
    return config
  },
};

export default nextConfig;

