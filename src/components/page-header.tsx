'use client'

import { Typography } from '@mui/material'
import { styled } from '@mui/material/styles'

type PageHeaderProps = {
  readonly title: string
  readonly subtitle: string
}

const PageHeaderRoot = styled('div', {
  name: 'PageHeader',
  slot: 'root',
})(({ theme }) => ({
  textAlign: 'center',
  marginBottom: theme.spacing(3),
}))

const PageHeader = ({ subtitle, title }: PageHeaderProps) => (
  <PageHeaderRoot>
    <Typography
      variant="h2"
      sx={{
        mb: 1,
      }}
    >
      {title}
    </Typography>
    <Typography
      variant="h5"
      gutterBottom
      sx={{
        color: 'text.secondary',
      }}
    >
      {subtitle}
    </Typography>
  </PageHeaderRoot>
)

export default PageHeader
