let apiHost = 'localhost';
let apiProtocol = 'http';

if (process.env.NEXT_PUBLIC_API_URL) {
  try {
    const parsed = new URL(process.env.NEXT_PUBLIC_API_URL);
    apiHost = parsed.hostname;
    apiProtocol = parsed.protocol.replace(':', '');
  } catch (err) {
    // Fail-safe default
  }
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: './',
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: apiProtocol,
        hostname: apiHost,
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;