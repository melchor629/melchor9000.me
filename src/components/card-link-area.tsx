'use client'

import { CardActionArea, type CardActionAreaProps } from '@mui/material'
import Link from 'next/link'

export type CardLinkAreaProps = CardActionAreaProps<'a'>
const Component = CardActionArea<'a'>

const CardLinkArea = (props: CardLinkAreaProps) =>
  // eslint-disable-next-line jsx-a11y/anchor-has-content
  <Component {...props} component="a" LinkComponent={Link} />

export default CardLinkArea
