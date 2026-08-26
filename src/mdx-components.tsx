/* eslint-disable jsx-a11y/heading-has-content */
import { Typography } from '@mui/material'
import type { MDXComponents } from 'mdx/types'
import Code from './components/code'
import CodeBlock from './components/code-block'
import NextLink from './components/next-link'
import BlockQuote from './components/quote'

// eslint-disable-next-line import-x/prefer-default-export
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    h1: ({ ref, ...props }) => (
      <Typography
        {...props}
        variant="h3"
        component="h1"
        gutterBottom
        sx={{ mt: 4 }}
      />
    ),
    h2: ({ ref, ...props }) => (
      <Typography
        {...props}
        variant="h4"
        component="h2"
        gutterBottom
        sx={{ mt: 3 }}
      />
    ),
    h3: ({ ref, ...props }) => (
      <Typography
        {...props}
        variant="h5"
        component="h3"
        gutterBottom
        sx={{ mt: 2 }}
      />
    ),
    h4: ({ ref, ...props }) => (
      <Typography
        {...props}
        variant="h6"
        component="h4"
        gutterBottom
        sx={{ mt: 1.5 }}
      />
    ),
    h5: () => null,
    h6: () => null,
    p: ({ ref, ...props }) => (
      <Typography
        {...props}
        variant="body1"
        component="p"
        gutterBottom
        sx={{ fontSize: '1.125rem', lineHeight: 1.65 }}
      />
    ),

    blockquote: ({ ref, ...props }) => <BlockQuote {...props} />,
    pre: ({ ref, ...props }) => <CodeBlock {...props} />,
    code: ({ ref, ...props }) => (
      <Code
        {...props}
        sx={{ color: 'secondary.main' }}
      />
    ),
    a: (props) =>
      // oxlint-disable-next-line @typescript-eslint/no-unsafe-member-access
      (props.href as string).startsWith('/') ? (
        <NextLink
          {...props}
          prefetch
        />
      ) : (
        <NextLink
          {...props}
          target="_blank"
          referrerPolicy="origin"
          rel="noopener"
        />
      ),
  }
}
