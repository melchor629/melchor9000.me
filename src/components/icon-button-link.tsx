'use client'

import { IconButton, type IconButtonProps } from '@mui/material'
import Link from 'next/link'

export type IconButtonLinkProps = IconButtonProps<'a'> & { readonly href: string }

const IconButtonLink = (props: IconButtonLinkProps) =>
  <IconButton {...props} href={props.href} LinkComponent={Link} />

export default IconButtonLink
