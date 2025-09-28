'use client'

import { styled } from '@mui/material/styles'

const CodeBlock = styled('pre', {
  name: 'CodeBlock',
  slot: 'root',
})(({ theme }) => theme.unstable_sx({
  overflow: 'auto',
  mx: 0.5,
  my: 2,
  p: 2,
  maxHeight: 'calc(100dvh - 100px)',
  minHeight: '30px',
  boxShadow: 3,
  ...theme.applyStyles('light', { backgroundColor: '#f6f6f6' }),
  ...theme.applyStyles('dark', { backgroundColor: '#1c1b1b' }),
  '&, & > code': {
    borderRadius: 1,
    color: theme.vars.palette.text.secondary,
  },
  '& > code.hljs': {
    padding: '0 !important',
  },
}))

export default CodeBlock
