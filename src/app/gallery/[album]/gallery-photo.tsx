import { Card, CardMedia, Tooltip } from '@mui/material'
import { thumbHashToDataURL } from 'thumbhash'
import CardLinkArea from '@/components/card-link-area'
import StyledImage from '@/components/styled-image'

type Props = {
  readonly albumId: string
  readonly id: string
  readonly title: string
  readonly thumbHash: string | null
  readonly thumbUrl: string
}

const popperProps = {
  modifiers: [
    {
      name: 'offset',
      options: { offset: [0, -8] },
    },
  ],
}

export default function GalleryPhoto({ albumId, id, thumbHash, thumbUrl, title }: Props) {
  return (
    <Tooltip
      title={title}
      arrow
      disableInteractive
      enterDelay={500}
      slotProps={{ popper: popperProps }}
    >
      <Card>
        <CardLinkArea href={`/gallery/${albumId}/${id}`} sx={{ height: '100%' }}>
          <CardMedia sx={{ position: 'relative', pb: '100%' }}>
            <StyledImage
              src={thumbUrl}
              alt={title}
              sizes="(min-width: 450px) 400px, 100vw"
              fill
              fit="cover"
              placeholder={thumbHash ? 'blur' : 'empty'}
              blurDataURL={
                thumbHash ? thumbHashToDataURL(Buffer.from(thumbHash, 'base64')) : undefined
              }
            />
          </CardMedia>
        </CardLinkArea>
      </Card>
    </Tooltip>
  )
}
