import { ArrowBack, NavigateBefore, NavigateNext } from '@mui/icons-material'
import { Tooltip } from '@mui/material'
import type { Album, Asset } from '@/clients/gallery'
import IconButtonLink from '@/components/icon-button-link'
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
        <IconButtonLink href={`./${prevPhotoId}`} disabled={!prevPhotoId}>
          <NavigateBefore />
        </IconButtonLink>
      </PhotoCanvasPrevious>
      <PhotoCanvasNext>
        <IconButtonLink href={`./${nextPhotoId}`} disabled={!nextPhotoId}>
          <NavigateNext />
        </IconButtonLink>
      </PhotoCanvasNext>
      <PhotoCanvasBack>
        <Tooltip
          title={`Back to ${album.title}`}
          placement="right"
          disableInteractive
        >
          <IconButtonLink href=".">
            <ArrowBack />
          </IconButtonLink>
        </Tooltip>
      </PhotoCanvasBack>
    </PhotoCanvasRoot>
  )
}
