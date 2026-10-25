/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === "production"

const nextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: isProd ? "/FreeDomains" : "",
  assetPrefix: isProd ? "/FreeDomains/" : "",
  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
}

export default nextConfig
