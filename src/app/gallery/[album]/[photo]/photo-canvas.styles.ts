'use client'

import { styled } from '@mui/material/styles'

export const PhotoCanvasRoot = styled('div', {
  name: 'PhotoCanvas',
  slot: 'root',
})({
  position: 'relative',
  mt: 1,
  mb: 1,
  height: 'calc(100dvh - 48px - 2 * 8px)',
})

export const PhotoCanvasPrevious = styled('div', {
  name: 'PhotoCanvas',
  slot: 'previous',
})({
  position: 'absolute',
  bottom: 8,
  left: 8,
})

export const PhotoCanvasNext = styled('div', {
  name: 'PhotoCanvas',
  slot: 'next',
})({
  position: 'absolute',
  bottom: 8,
  right: 8,
})

export const PhotoCanvasBack = styled('div', {
  name: 'PhotoCanvas',
  slot: 'back',
})({
  position: 'absolute',
  top: 0,
  left: 8,
})
