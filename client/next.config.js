/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  trailingSlash: true,
  rewrites: function() {
    return [
      {
        source: "/cms/:path*/",
        destination: "http://django:8000/cms/:path*/",
      },
      {
        source: "/api/:path*",
        destination: "http://django:8000/api/:path*/",
      },
    ];
  }
}

module.exports = nextConfig
