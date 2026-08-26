import MuiContainer from '@mui/material/Container'
import type { PropsWithChildren } from 'react'

type Props = PropsWithChildren<{
  readonly component?: 'article' | 'div'
}>

const Container = ({ children, component = 'div' }: Props) => (
  <MuiContainer
    component={component}
    maxWidth="lg"
    sx={{ py: 2 }}
  >
    {children}
  </MuiContainer>
)

export default Container
