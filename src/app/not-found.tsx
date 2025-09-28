import { Box, Typography } from '@mui/material'
import NextLink from '@/components/next-link'

export default function NotFound() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: 'calc(100lvh - 48px)',
        textAlign: 'center',
        px: 4,
        py: 1,
        userSelect: 'none',
      }}
    >
      <Typography variant="h2" gutterBottom>
        What are you looking for?
      </Typography>
      <Typography variant="h3" gutterBottom color="textSecondary">
        Really?
      </Typography>
      <Typography variant="subtitle1" gutterBottom color="textDisabled">
        Whatever you are looking for is not here...
        Try looking in another place, or go&nbsp;
        <NextLink href="/">home</NextLink>
        .
      </Typography>
    </Box>
  )
}
