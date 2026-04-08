/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      // Legacy static HTML pages
      { source: '/privacy.html', destination: '/privacy', permanent: true },
      { source: '/disclaimer.html', destination: '/disclaimer', permanent: true },
      { source: '/contact.html', destination: '/contact', permanent: true },
      { source: '/terms-of-service.html', destination: '/terms-of-service', permanent: true },

      // Blog .html → new /blog/[slug] routes (301 permanent — preserves SEO juice)
      { source: '/blog.html', destination: '/resources', permanent: true },
      { source: '/blog-deadlines.html', destination: '/blog/ontario-accident-deadlines', permanent: true },
      { source: '/blog-sabs.html', destination: '/blog/ontario-sabs-explained', permanent: true },
      { source: '/blog-settlement.html', destination: '/blog/should-you-accept-first-settlement-offer', permanent: true },
      { source: '/blog-irb.html', destination: '/blog/income-replacement-rehab-benefits-ontario', permanent: true },
      { source: '/blog-dispute.html', destination: '/blog/ontario-insurer-dispute-process', permanent: true },
      { source: '/blog-fault.html', destination: '/blog/fault-accident-benefits-ontario', permanent: true },
      { source: '/blog-slip.html', destination: '/blog/slip-and-fall-ontario-occupiers-liability', permanent: true },

      // Old short rewrites that may have been shared as links
      { source: '/blog/deadlines', destination: '/blog/ontario-accident-deadlines', permanent: true },
      { source: '/blog/sabs', destination: '/blog/ontario-sabs-explained', permanent: true },
      { source: '/blog/settlement', destination: '/blog/should-you-accept-first-settlement-offer', permanent: true },
      { source: '/resources/deadlines', destination: '/blog/ontario-accident-deadlines', permanent: true },
      { source: '/resources/sabs', destination: '/blog/ontario-sabs-explained', permanent: true },
      { source: '/resources/settlement', destination: '/blog/should-you-accept-first-settlement-offer', permanent: true },
    ];
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};
export default nextConfig;
