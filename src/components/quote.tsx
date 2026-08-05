'use client'

import { FormatQuote } from '@mui/icons-material'
import { styled } from '@mui/material/styles'
import type { ComponentPropsWithRef } from 'react'

const BlockQuoteRoot = styled('blockquote', {
  name: 'BlockQuote',
  slot: 'root',
})(({ theme }) => ({
  display: 'flex',
  paddingBlock: theme.spacing(0.5),
  paddingInline: theme.spacing(1),
  margin: 0,
  marginInline: theme.spacing(0.5),
  marginBlockEnd: theme.spacing(1.25),
  borderLeft: '3px solid',
  borderLeftColor: theme.vars.palette.text.secondary,
  gap: theme.spacing(1.5),
  color: theme.vars.palette.text.secondary,
}))

const BlockQuoteIcon = styled(FormatQuote, {
  name: 'BlockQuote',
  slot: 'icon',
})({
  display: 'block',
  width: 24,
})

const BlockQuoteContent = styled('div', {
  name: 'BlockQuote',
  slot: 'content',
})({
  flexGrow: 1,
})

const BlockQuote = ({ children, ...props }: ComponentPropsWithRef<'blockquote'>) => (
  <BlockQuoteRoot {...props}>
    <BlockQuoteIcon />
    <BlockQuoteContent>{children}</BlockQuoteContent>
  </BlockQuoteRoot>
)

export default BlockQuote
