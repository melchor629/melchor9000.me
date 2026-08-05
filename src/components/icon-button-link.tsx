'use client'

import { IconButton, type IconButtonProps } from '@mui/material'
import Link from 'next/link'

export type IconButtonLinkProps = IconButtonProps &
  Readonly<{
    href: string
    target?: IconButtonProps<'a'>['target']
    referrerPolicy?: IconButtonProps<'a'>['referrerPolicy']
  }>

const IconButtonLink = ({
  children,
  href,
  referrerPolicy,
  target,
  ...props
}: IconButtonLinkProps) => (
  <Link href={href} target={target} referrerPolicy={referrerPolicy}>
    <IconButton {...props}>{children}</IconButton>
  </Link>
)

export default IconButtonLink
