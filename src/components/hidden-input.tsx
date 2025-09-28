'use client'

import { styled } from '@mui/material/styles'

const HiddenInput = styled('input', {
  name: 'HiddenInput',
  slot: 'root',
  skipVariantsResolver: true,
  skipSx: true,
})({
  display: 'none',
})

export default HiddenInput
