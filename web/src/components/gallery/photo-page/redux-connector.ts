import { useMemo } from 'react'
import { shallowEqual } from 'react-redux'

import { useDispatch, useSelector } from '../../../redux'
import {
  hideDetailed, loadDetailedPhoto, detailedPhotoLoaded, nextDetailed, prevDetailed,
} from '../../../redux/gallery/actions'
import { changeNavbarHideMode } from '../../../redux/effects/actions'

export const usePhotoState = (photosetId: string) => useSelector(({ gallery }) => {
  const photoset = gallery.photosets[photosetId]
  const currentPhotoIndex = photoset?.photos
    .findIndex((p) => p.id === gallery.detailed.currentPhotoId) ?? -1
  const nextPhotoId = currentPhotoIndex >= 0 && currentPhotoIndex + 1 < (photoset?.totalPhotos ?? 0)
    ? currentPhotoIndex + 1
    : -1
  const prevPhotoId = currentPhotoIndex !== -1 && currentPhotoIndex - 1 >= 0
    ? currentPhotoIndex - 1
    : -1
  return {
    currentPhoto: gallery.photos[gallery.detailed.currentPhotoId || '']
      || photoset?.photos[currentPhotoIndex],
    previousPhoto: gallery.photos[gallery.detailed.previousPhotoId || ''],
    isZoomed: gallery.detailed.zoomEnabled,
    nextPhoto: photoset?.photos[nextPhotoId],
    prevPhoto: photoset?.photos[prevPhotoId],
    totalPhotos: photoset?.totalPhotos,
    imageIsLoading: gallery.detailed.loadingPhoto,
    directionOfChange: gallery.detailed.directionOfChange,
    imageInfoIsLoading: gallery.detailed.loadingInfo || (photoset?.loading ?? false),
    imageSwitcher: gallery.detailed.imageSwitcher,
    error: gallery.detailed.error,
    photosetError: photoset?.error,
  }
}, shallowEqual)

export const usePhotoActions = (photosetId: string) => {
  const dispatch = useDispatch()
  return useMemo(() => ({
    loadFullInfoForPhoto: (photoId: string) => (
      dispatch(loadDetailedPhoto(photoId, photosetId))
    ),
    photoIsLoaded: () => dispatch(detailedPhotoLoaded()),
    next: () => dispatch(nextDetailed()),
    prev: () => dispatch(prevDetailed()),
    close: () => dispatch(hideDetailed()),
    enableHideNavbarOnTopMode: () => dispatch(changeNavbarHideMode('top-only')),
    disableHideNavbarOnTopMode: () => dispatch(changeNavbarHideMode(null)),
  }), [photosetId, dispatch])
}
