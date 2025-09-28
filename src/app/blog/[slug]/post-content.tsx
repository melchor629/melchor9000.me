import { Box } from '@mui/material'
import { type FC } from 'react'
import './highlight.css'

export default function PostContent({ content: Content }: { readonly content: FC<object> }) {
  return <Box sx={{ px: { xs: 2, md: 4, xl: 6 }, pb: { xs: 4, md: 6 } }}><Content /></Box>
}
