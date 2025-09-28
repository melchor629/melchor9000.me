'use client'

import { Box, Typography } from '@mui/material'
import type { ComponentPropsWithRef } from 'react'

type LabelledTypographyProps = ComponentPropsWithRef<typeof Typography> & {
  readonly label: string
  readonly fontSize?: undefined
  readonly size?: 'small' | 'large'
}

export default function LabelledTypography({ label, size, ...props }: LabelledTypographyProps) {
  return (
    <Box sx={{ display: 'inline-block' }}>
      <Typography
        variant="body2"
        color="text.secondary"
        fontSize={(size === 'small' && '0.75rem') || (size === 'large' && '1rem') || undefined}
        sx={{ userSelect: 'none' }}
      >
        {label}
      </Typography>
      <Typography
        {...props}
        fontSize={(size === 'small' && '0.875rem') || (size === 'large' && '1.25rem') || undefined}
      />
    </Box>
  )
}
