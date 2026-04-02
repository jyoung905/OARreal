/** @type {import('next').NextConfig} */
const nextConfig = {
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
};
export default nextConfig;
