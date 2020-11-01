import { DateTime } from 'luxon'
import React, { memo, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet'
import { GalleryPhoto, GalleryPhotosetPhoto } from '../../../redux/gallery/reducers'
import { DefaultContainer } from '../../default-container'
import LoadSpinner from '../../load-spinner'

interface OverlayImageInfoProps {
  photo: GalleryPhoto | GalleryPhotosetPhoto
  loading: boolean
  rootRef?: React.RefObject<HTMLDivElement>
}

const ImageInfoView = ({
  photo, loading, rootRef,
}: OverlayImageInfoProps) => {
  const [t] = useTranslation()
  let geolocation = null

  const InfoItem = useMemo(() => ({ id, children }: { id: string, children: any }) => (
    children
      ? (
        <div className="lead col-12 col-md-6 mb-2 info-item">
          <small>{ t(`gallery.photoPage.${id}`) }</small>
          <br />
          <span>{ children }</span>
        </div>
      )
      : null
  ), [t])

  if (!('dateTaken' in photo) || loading) {
    return (
      <div className="image-info" ref={rootRef}>
        <DefaultContainer>
          <Helmet>
            <title>
              { photo.title }
              {' '}
              - Gallery
            </title>
          </Helmet>

          <div className="page-header">
            <h2>{photo.title}</h2>
          </div>

          <div className="d-flex justify-content-center"><LoadSpinner /></div>
        </DefaultContainer>
      </div>
    )
  }

  const { exif } = photo
  if ('location' in photo && photo.location) {
    const l = photo.location
    const locationString = [
      l.neighbourhood && `${l.neighbourhood},`,
      l.locality && `${l.locality},`,
      l.county && `${l.county} -`,
      l.region,
      l.country && `(${l.country})`,
    ].filter((f) => f).join(' ')
    const url = `https://www.google.es/maps/@${l.latitude},${l.longitude},15z?q=${l.latitude},${l.longitude}`
    geolocation = (
      <InfoItem id="geoposition">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
        >
          {locationString}
        </a>
      </InfoItem>
    )
  }

  return (
    <div className="image-info" ref={rootRef}>
      <DefaultContainer>
        <Helmet>
          <title>
            { photo.title }
            {' '}
            - Gallery
          </title>
          <meta name="Description" content={`Photo: ${photo.description}`} />
        </Helmet>

        <div className="page-header">
          <h2>{ photo.title }</h2>
          <span id="descripcion">{photo.description}</span>
        </div>

        <div className="mt-3 row">
          <InfoItem id="captureDate">
            {
              photo.dateTaken
                .toLocaleString({
                  ...DateTime.DATETIME_HUGE,
                  timeZone: undefined,
                  timeZoneName: undefined,
                })
            }
          </InfoItem>
          {geolocation}
          <InfoItem id="camera">{photo.camera}</InfoItem>
          <InfoItem id="lens">{exif.ExifIFD?.LensModel?.value}</InfoItem>
          <InfoItem id="exposure">{exif.ExifIFD?.ExposureTime?.value}</InfoItem>
          <InfoItem id="aperture">{exif.ExifIFD?.FNumber?.value}</InfoItem>
          <InfoItem id="iso">{exif.ExifIFD?.ISO?.value}</InfoItem>
          <InfoItem id="focalDistance">{exif.ExifIFD?.FocalLength?.value}</InfoItem>
          <InfoItem id="flash">
            {
              exif.ExifIFD?.Flash?.value
                && t(`gallery.photoPage.flash-${!exif.ExifIFD!.Flash!.value.includes('Off')}`)
            }
          </InfoItem>
          <InfoItem id="width">
            {
              exif.IFD0?.ImageWidth?.value
                || photo.sizes.find((s) => s.label === 'Original')?.width
            }
          </InfoItem>
          <InfoItem id="height">
            {
              exif.IFD0?.ImageHeight?.value
                || ('sizes' in photo && photo.sizes.find((s) => s.label === 'Original')?.height)
            }
          </InfoItem>
          <InfoItem id="rotation">
            {
              exif.IFD0?.Orientation?.value
                && /(\d+)/.exec(exif.IFD0!.Orientation!.value)
                && `${(exif.IFD0!.Orientation!.value.endsWith('CCW') ? '-' : '')
                      + /(\d+)/.exec(exif.IFD0!.Orientation!.value)![1]}º`
            }
          </InfoItem>
          <InfoItem id="exposureMode">{exif.ExifIFD?.ExposureMode?.value}</InfoItem>
          <InfoItem id="colorSpace">{exif.ExifIFD?.ColorSpace?.value}</InfoItem>
          <InfoItem id="software">{exif.IFD0?.Software?.value}</InfoItem>
        </div>

        <div className="mt-2">
          {photo.urls.length > 0 && (
            <p id="enlace">
              <a href={photo.urls[0].url} target="_blank" rel="noopener noreferrer">
                {t('gallery.photoPage.seeFlickr')}
              </a>
            </p>
          )}
        </div>
      </DefaultContainer>
    </div>
  )
}

ImageInfoView.defaultProps = {
  rootRef: undefined as (React.RefObject<HTMLDivElement> | undefined),
}

const ImageInfoViewMemo = memo(
  ImageInfoView,
  (a, b) => a.photo.id === b.photo.id && a.loading === b.loading,
)

export default ImageInfoViewMemo
