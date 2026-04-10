/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  turbopack: {
    root: '.',
  },
  images: {
    unoptimized: true,
  },
  async rewrites() {
    const springUrl = process.env.SPRING_API_URL || 'http://localhost:8081'
    return [
      // Proxy plate images directly to Spring Boot
      {
        source: '/api/plates/image/:plateNumber',
        destination: `${springUrl}/api/plates/image/:plateNumber`,
      },
    ]
  },
}

export default nextConfig
