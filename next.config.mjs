/** @type {import('next').NextConfig} */
const nextConfig = {
  staticPageGenerationTimeout: 120,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'thumbnail.coupangcdn.com', pathname: '/**' },
      { protocol: 'https', hostname: 'img1a.coupangcdn.com', pathname: '/**' },
      { protocol: 'https', hostname: 'image.coupangcdn.com', pathname: '/**' },
    ],
  },
};

export default nextConfig;
