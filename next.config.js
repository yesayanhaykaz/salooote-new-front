/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [],
    unoptimized: true,
  },
  async redirects() {
    return [
      {
        source: "/:lang(en|hy|ru)/newhomepage",
        destination: "/:lang",
        permanent: true,
      },
      {
        source: "/:lang(en|hy|ru)/newhomepage2nd",
        destination: "/:lang",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
