import { ArrowBack, NavigateBefore, NavigateNext } from '@mui/icons-material'
import { IconButton, Tooltip } from '@mui/material'
import Link from 'next/link'
import type { Album, Asset } from '@/clients/gallery'
import Photo from './photo'
import { PhotoCanvasBack, PhotoCanvasNext, PhotoCanvasPrevious, PhotoCanvasRoot } from './photo-canvas.styles'

type PhotoCanvasProps = {
  readonly album: Album
  readonly photo: Asset
  readonly prevPhotoId: string | null
  readonly nextPhotoId: string | null
}

export default function PhotoCanvas({
  album,
  nextPhotoId,
  photo,
  prevPhotoId,
}: PhotoCanvasProps) {
  return (
    <PhotoCanvasRoot>
      <Photo
        title={photo.title}
        height={photo.exif!.height!}
        width={photo.exif!.width!}
        url={`/gallery/${album.id}/${photo.id}/original`}
      />
      <PhotoCanvasPrevious>
        <IconButton component={Link} href={`./${prevPhotoId}`} disabled={!prevPhotoId}>
          <NavigateBefore />
        </IconButton>
      </PhotoCanvasPrevious>
      <PhotoCanvasNext>
        <IconButton component={Link} href={`./${nextPhotoId}`} disabled={!nextPhotoId}>
          <NavigateNext />
        </IconButton>
      </PhotoCanvasNext>
      <PhotoCanvasBack>
        <Tooltip
          title={`Back to ${album.title}`}
          placement="right"
          disableInteractive
        >
          <IconButton component={Link} href=".">
            <ArrowBack />
          </IconButton>
        </Tooltip>
      </PhotoCanvasBack>
    </PhotoCanvasRoot>
  )
}
