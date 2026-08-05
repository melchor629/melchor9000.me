'use client'

import { Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import type { ComponentPropsWithRef } from 'react'

const Code = styled(
  (props: ComponentPropsWithRef<typeof Typography>) => <Typography {...props} component="code" />,
  {
    name: 'Code',
    slot: 'root',
  },
)({
  fontFamily: 'var(--me-roboto-mono-font)',
  wordBreak: 'break-all',
})

export default Code
