'use client'

import { Box, Typography, type Theme } from '@mui/material'
import type { SystemStyleObject } from '@mui/system'
import type { ComponentPropsWithRef } from 'react'

type LabelledTypographyProps = Omit<ComponentPropsWithRef<typeof Typography>, 'sx' | 'fontSize'> & {
  readonly label: string
  readonly size?: 'small' | 'large'
  readonly sx?: SystemStyleObject<Theme>
}

export default function LabelledTypography({ label, size, ...props }: LabelledTypographyProps) {
  return (
    <Box sx={{ display: 'inline-block' }}>
      <Typography
        variant="body2"
        sx={{
          color: 'text.secondary',
          fontSize: (size === 'small' && '0.75rem') || (size === 'large' && '1rem') || undefined,
          userSelect: 'none',
        }}
      >
        {label}
      </Typography>
      <Typography
        {...props}
        sx={{
          ...props.sx,
          fontSize:
            (size === 'small' && '0.875rem') || (size === 'large' && '1.25rem') || undefined,
        }}
      />
    </Box>
  )
}
