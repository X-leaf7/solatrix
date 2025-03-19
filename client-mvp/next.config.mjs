import createMDX from '@next/mdx';

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['md', 'mdx', 'ts', 'tsx'],
  sassOptions: {
    silenceDeprecations: ['legacy-js-api'],
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
