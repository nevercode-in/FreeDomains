import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  async redirects() {
    return [{ source: "/docs", destination: "/", permanent: true }, { source: '/docs/:path*', destination: '/:path*', permanent: true }];
  },
};

export default withMDX(config);
