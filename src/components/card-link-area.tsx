'use client'

import { CardActionArea, type CardActionAreaProps } from '@mui/material'
import Link from 'next/link'

export type CardLinkAreaProps = CardActionAreaProps<'a'> & { readonly href: string }

const CardLinkArea = (props: CardLinkAreaProps) => (
  <CardActionArea {...props} href={props.href} LinkComponent={Link} />
)

export default CardLinkArea
