import { useMemo } from 'react'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'

import { State } from '../../../redux/reducers'
import {
  hideDetailed, loadDetailedPhoto, loadedPhotoImage, nextDetailed, prevDetailed,
} from '../../../redux/gallery/actions'
import { changeNavbarHideMode } from '../../../redux/effects/actions'

export const usePhotoState = (photosetId: string) => useSelector(({ galleryList }: State) => {
  const photoset = galleryList.photosets[photosetId]
  const currentPhotoIndex = photoset?.photos
    .findIndex((p) => p.id === galleryList.detailed.currentPhotoId) ?? -1
  const nextPhotoId = currentPhotoIndex >= 0 && currentPhotoIndex + 1 < (photoset?.totalPhotos ?? 0)
    ? currentPhotoIndex + 1
    : -1
  const prevPhotoId = currentPhotoIndex !== -1 && currentPhotoIndex - 1 >= 0
    ? currentPhotoIndex - 1
    : -1
  return {
    currentPhoto: galleryList.photos[galleryList.detailed.currentPhotoId || '']
      || photoset?.photos[currentPhotoIndex],
    previousPhoto: galleryList.photos[galleryList.detailed.previousPhotoId || ''],
    isZoomed: galleryList.detailed.zoomEnabled,
    nextPhoto: photoset?.photos[nextPhotoId],
    prevPhoto: photoset?.photos[prevPhotoId],
    totalPhotos: photoset?.totalPhotos,
    imageIsLoading: galleryList.detailed.loadingPhoto,
    directionOfChange: galleryList.detailed.directionOfChange,
    imageInfoIsLoading: galleryList.detailed.loadingInfo || (photoset?.loading ?? false),
    imageSwitcher: galleryList.detailed.imageSwitcher,
    photoset,
  }
}, shallowEqual)

export const usePhotoActions = (photosetId: string) => {
  const dispatch = useDispatch()
  return useMemo(() => ({
    loadFullInfoForPhoto: (photoId: string) => (
      dispatch(loadDetailedPhoto(photoId, photosetId))
    ),
    photoIsLoaded: () => dispatch(loadedPhotoImage()),
    next: () => dispatch(nextDetailed()),
    prev: () => dispatch(prevDetailed()),
    close: () => dispatch(hideDetailed()),
    enableHideNavbarOnTopMode: () => dispatch(changeNavbarHideMode('top-only')),
    disableHideNavbarOnTopMode: () => dispatch(changeNavbarHideMode(null)),
  }), [photosetId, dispatch])
}
