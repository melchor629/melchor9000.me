'use client'

import { styled } from '@mui/material/styles'

interface FigureProps {
  gutterBottom?: boolean
}

const Figure = styled('figure', { name: 'Figure' })<FigureProps>(({ gutterBottom, theme }) => ({
  position: 'relative',
  margin: 0,
  marginBottom: gutterBottom ? theme.spacing(2) : undefined,

  '> img': {
    borderRadius: theme.shape.borderRadius,
    marginBottom: theme.spacing(0.5),
    lineHeight: 1,
    width: '100%',
    height: 'auto',
  },

  '> figcaption': {
    color: theme.vars.palette.text.secondary,
    fontSize: '0.825rem',
  },
}))

const FigureCaption = styled('figcaption', { name: 'Figure', slot: 'caption' })({})

export { Figure, FigureCaption }
