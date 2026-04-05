/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Hide the "Compiling / Routing" dev indicator in the browser (dev only)
  devIndicators: false,
}

export default nextConfig
