'use client'

import { Box, CircularProgress } from '@mui/material'
import { useCallback, useState } from 'react'
import StyledImage from '@/components/styled-image'

type PhotoProps = {
  readonly title: string
  readonly url: string
  readonly width: number
  readonly height: number
}

export default function Photo({
  height,
  title,
  url,
  width,
}: PhotoProps) {
  const [imageLoading, setImageLoading] = useState(true)

  return (
    <>
      <StyledImage
        alt={title}
        src={url.toString()}
        width={width}
        height={height}
        sizes="100vw"
        priority
        quality={90}
        fit="contain"
        onLoad={useCallback(() => setImageLoading(false), [])}
      />

      {imageLoading && (
        <Box sx={{ position: 'absolute', left: 'calc(50% - 12px)', top: 'calc(50% - 12px)' }}>
          <CircularProgress size={24} />
        </Box>
      )}
    </>
  )
}
