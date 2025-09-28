import MuiLink from '@mui/material/Link'
import Link from 'next/link'

interface NextLinkProps extends React.ComponentPropsWithoutRef<typeof MuiLink> {
  readonly href: string
}

const NextLink = ({ children, href, ...props }: NextLinkProps) => (
  <MuiLink component={Link} href={href} {...props}>{children}</MuiLink>
)

export default NextLink
