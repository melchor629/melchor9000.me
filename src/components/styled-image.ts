'use client'

import { styled } from '@mui/material/styles'
import Image from 'next/image'

type Props = {
  noGrow?: boolean
  fit?: 'cover' | 'fill' | 'contain' | 'none'
  variant?: 'fancy' | 'plain'
}

const ignoredProps = ['fit', 'noGrow', 'variant']

const StyledImage = styled(Image, {
  name: 'StyledImage',
  shouldForwardProp: (propName) => typeof propName !== 'string' || !ignoredProps.includes(propName),
})<Props>(({ fit }) => ({
  objectFit: fit,
  width: '100%',
  height: fit !== 'none' ? '100%' : undefined,
  variants: [
    {
      props: { variant: 'fancy' },
      style: ({ theme }) => ({
        borderRadius: theme.vars.shape.borderRadius,
        marginBlock: theme.spacing(0.75),
        boxShadow: theme.vars.shadows[5],
      }),
    },
    {
      props: { noGrow: true },
      style: {
        width: 'initial',
        height: 'initial',
      },
    },
  ],
}))

export default StyledImage
