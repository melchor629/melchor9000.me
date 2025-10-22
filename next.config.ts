import createMDX from '@next/mdx'
// import glslLanguage from 'highlight.js/lib/languages/glsl'
// import { common as commonLanguages } from 'lowlight'
import type { NextConfig } from 'next'

// metadata https://www.boar.is/p/nextjs-metadata

const nextConfig: NextConfig = {
  compiler: {
    emotion: false,
    removeConsole: true,
  },
  images: {
    remotePatterns: [
      {
        hostname: '*.staticflickr.com',
        protocol: 'https',
        pathname: '/*/*.jpg',
      },
      {
        hostname: 'photos.melchor9000.me',
        protocol: 'https',
        pathname: '/api/assets/**',
      },
      {
        hostname: 'i.imgur.com',
        protocol: 'https',
        pathname: '/*',
      },
    ],
    qualities: [75, 90],
  },
  modularizeImports: {
    '@mui/icons-material': {
      transform: '@mui/icons-material/{{member}}',
    },
    '@mui/lab': {
      transform: '@mui/lab/{{member}}',
    },
    '@mui/material': {
      transform: '@mui/material/{{member}}',
    },
  },
  reactStrictMode: true,
  reactCompiler: false,
}

const withMDX = createMDX({
  options: {
    remarkPlugins: [
      ['remark-gfm', {}],
      ['remark-math', {}],
    ],
    rehypePlugins: [
      ['rehype-highlight', {
        subset: false,
        ignoreMissing: true,
        // NOTE: do not work in next 15 using turbo
        /* languages: {
          ...commonLanguages,
          glsl: glslLanguage,
        }, */
      }],
      ['rehype-katex', {}],
    ],
  },
})

export default withMDX(nextConfig)
