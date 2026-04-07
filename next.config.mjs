/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      { source: '/privacy.html', destination: '/privacy', permanent: true },
      { source: '/disclaimer.html', destination: '/disclaimer', permanent: true },
      { source: '/contact.html', destination: '/contact', permanent: true },
      { source: '/terms-of-service.html', destination: '/terms-of-service', permanent: true },
    ];
  },
  async rewrites() {
    return [
      { source: '/blog', destination: '/blog.html' },
      { source: '/blog/deadlines', destination: '/blog-deadlines.html' },
      { source: '/blog/sabs', destination: '/blog-sabs.html' },
      { source: '/blog/settlement', destination: '/blog-settlement.html' },
      { source: '/resources', destination: '/blog.html' },
      { source: '/resources/deadlines', destination: '/blog-deadlines.html' },
      { source: '/resources/sabs', destination: '/blog-sabs.html' },
      { source: '/resources/settlement', destination: '/blog-settlement.html' },
    ];
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};
export default nextConfig;
