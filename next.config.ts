import createMDX from '@next/mdx'
// import glslLanguage from 'highlight.js/lib/languages/glsl'
// import { common as commonLanguages } from 'lowlight'
import type { NextConfig } from 'next'

// metadata https://www.boar.is/p/nextjs-metadata

const nextConfig: NextConfig = {
  cacheComponents: true,
  compiler: {
    emotion: false,
    removeConsole: true,
  },
  generateBuildId: async () => {
    if (process.env.BUILD_ID) {
      return process.env.BUILD_ID
    }

    const childProcess = await import('node:child_process')
    return childProcess.execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim()
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
    '@icons-pack/react-simple-icons': {
      transform: '@icons-pack/react-simple-icons/icons/{{member}}'
    },
  },
  output: 'standalone',
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
      [
        'rehype-highlight',
        {
          subset: false,
          ignoreMissing: true,
          // NOTE: do not work in next 15 using turbo
          /* languages: {
          ...commonLanguages,
          glsl: glslLanguage,
        }, */
        },
      ],
      ['rehype-katex', {}],
    ],
  },
})

export default withMDX(nextConfig)
