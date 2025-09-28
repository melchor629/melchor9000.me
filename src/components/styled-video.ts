'use client'

import { styled } from '@mui/material/styles'

type Props = {
  fit?: 'cover' | 'fill' | 'contain'
  variant?: 'fancy' | 'plain'
}

const StyledVideo = styled('video', {
  name: 'StyledVideo',
  shouldForwardProp: (propName) => propName !== 'fit' && propName !== 'variant',
})<Props>(({ fit }) => ({
  objectFit: fit,
  width: '100%',
  height: '100%',
  aspectRatio: '16/9',
  variants: [
    {
      props: { variant: 'fancy' },
      style: ({ theme }) => ({
        borderRadius: theme.vars.shape.borderRadius,
        marginBlock: theme.spacing(0.75),
        boxShadow: theme.vars.shadows[5],
      }),
    },
  ],
}))

export default StyledVideo
