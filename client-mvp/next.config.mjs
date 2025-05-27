import createMDX from '@next/mdx';

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['md', 'mdx', 'ts', 'tsx'],
  sassOptions: {
    silenceDeprecations: ['legacy-js-api'],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '135.181.137.214',
        port: '8088',
        pathname: '/media/**',
      },
      {
        protocol: 'http',
        hostname: 'django',
        port: '8000',
        pathname: '/media/**',
      },
      // If you need to support localhost during development
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/media/**',
      },
    ],
  },
  rewrites: function () {
    return [
      {
        source: "/cms/:path*/",
        destination: "http://django:8000/cms/:path*/",
      },
      {
        source: "/api/:path*",
        destination: "http://django:8000/api/:path*/",
      },
      {
        source: '/media/:path*',
        destination: 'http://django:8000/media/:path*',
      }
    ];
  }
};

const withMDX = createMDX({
  // Add markdown plugins here, as desired
});

export default withMDX(nextConfig);