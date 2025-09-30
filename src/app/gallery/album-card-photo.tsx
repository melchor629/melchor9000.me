import { Box, CardMedia } from '@mui/material'
import { thumbHashToDataURL } from 'thumbhash'
import StyledImage from '@/components/styled-image'

type Props = {
  readonly assetId: string | null
  readonly thumbHash?: string | null
  readonly thumbUrl: string
}

export default function AlbumCardPhoto({ assetId, thumbHash, thumbUrl }: Props) {
  if (!assetId) {
    return <Box sx={{ height: 140, bgcolor: 'text.secondary' }} />
  }

  return (
    <CardMedia component={Box} position="relative" height={140}>
      <StyledImage
        src={thumbUrl}
        alt="Image that represents the album"
        sizes="(min-width: 400px) 315px, 100vw"
        fill
        priority
        fit="cover"
        placeholder={thumbHash ? 'blur' : 'empty'}
        blurDataURL={thumbHash ? thumbHashToDataURL(Buffer.from(thumbHash, 'base64')) : undefined}
      />
    </CardMedia>
  )
}
