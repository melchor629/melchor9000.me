import type { Dispatch } from 'redux'
import { debounce } from 'debounce'

import flickr, { PhotosetPhoto } from '../../lib/flickr'
import type { GalleryState } from './state'
import gallerySlice from './slice'
import { State } from '../store'

const {
  detailedChangePhoto,
  detailedHidden,
  detailedLoadingInfo,
  detailedLoadedInfo,
  detailedPhotoError,
  detailedPhotoIsGoingToChange,
  errorLoading,
  firstPhotosLoaded,
  loadedPhotos,
  loadingPhotos,
} = gallerySlice.actions

const howMuchToLoad = 500

export const { detailedPhotoLoaded } = gallerySlice.actions

export const hideDetailed = detailedHidden

export const nextDetailed = () => detailedPhotoIsGoingToChange('next')

export const prevDetailed = () => detailedPhotoIsGoingToChange('prev')

export const loadFirstPhotos = (photosetId: string) => (
  async (dispatch: Dispatch, getState: () => State) => {
    if (getState().gallery.photosets[photosetId]?.photos.length) {
      return
    }

    try {
      const photoset = await flickr.photosets.getPhotos(photosetId, {
        perPage: howMuchToLoad,
        page: 1,
      })
      const primaryPhoto = getState().gallery.photos[photoset.primary]
        || await flickr.photos.getInfo(photoset.primary)
      dispatch(firstPhotosLoaded({
        ...photoset,
        primary: primaryPhoto.sizes.find((s) => s.label === 'Large')!.source,
      }, primaryPhoto))
    } catch (e) {
      dispatch(errorLoading(photosetId, e as Error))
    }
  }
)

export const loadMorePhotos = (
  photosetId: string,
) => async (dispatch: Dispatch, getState: () => State) => {
  const { gallery: { photosets } } = getState()
  const storedPhotoset = photosets[photosetId]
  if (!storedPhotoset) {
    return
  }

  const { totalPhotos, photos: storedPhotos } = storedPhotoset
  if (totalPhotos === storedPhotos.length) {
    return
  }

  dispatch(loadingPhotos({ photosetId }))

  try {
    const photoset = await flickr.photosets.getPhotos(photosetId, {
      perPage: howMuchToLoad,
      page: Math.floor(storedPhotos.length / howMuchToLoad) + 1,
    })
    dispatch(loadedPhotos(photoset))
  } catch (e) {
    dispatch(errorLoading(photosetId, e as Error))
  }
}

const loadDetailedPhotoImpl = debounce(async (
  dispatch: Dispatch,
  photoId: string,
  state: GalleryState,
  photosetId: string,
) => {
  if (state.photos[photoId]) {
    // image has already been loaded
    dispatch(detailedChangePhoto(photoId))
    return
  }

  dispatch(detailedLoadingInfo(photoId))
  const photoset = state.photosets[photosetId]
  const isFirstLoad = !photoset?.photos.length
  const photosList: PhotosetPhoto[] = []
  let totalPhotos = isFirstLoad || !photoset ? 1 : photoset.totalPhotos
  let primary: string = ''
  let owner = ''
  let pages = 0
  const countPhotos = () => photosList.length + (photoset?.photos.length ?? 0)
  try {
    while (countPhotos() < totalPhotos) {
      // eslint-disable-next-line no-await-in-loop
      const result = await flickr.photosets.getPhotos(photosetId, {
        perPage: howMuchToLoad,
        page: Math.floor(photosList.length + (photoset?.photos.length ?? 0)) / howMuchToLoad + 1,
      })
      photosList.push(...result.photos)

      if (isFirstLoad && !primary) {
        totalPhotos = result.total
        primary = result.primary
        owner = result.owner
        pages = result.pages
      }
    }

    if (isFirstLoad) {
      const primaryPhoto = state.photos[primary] || await flickr.photos.getInfo(primary)
      dispatch(firstPhotosLoaded({
        id: photosetId,
        owner,
        page: Math.floor(photosList.length + (photoset?.photos.length ?? 0)) / howMuchToLoad,
        pages,
        photos: photosList,
        primary: primaryPhoto.sizes.find((s) => s.label === 'Large')!.source,
        total: totalPhotos,
      }, primaryPhoto))
    } else if (photosList.length > 0) {
      dispatch(loadedPhotos({
        id: photosetId,
        owner,
        pages,
        page: Math.floor(photosList.length + (photoset?.photos.length ?? 0)) / howMuchToLoad,
        photos: photosList,
        primary: '',
        total: totalPhotos,
      }))
    }
  } catch (e) {
    dispatch(errorLoading(photosetId, e as Error))
    return
  }

  const photo = photoset?.photos.find((p) => p.id === photoId)
    || photosList.find((p) => p.id === photoId)
  if (!photo) {
    dispatch(detailedPhotoError(photoId))
    return
  }

  try {
    const info = await flickr.photos.getInfo(photoId)
    dispatch(detailedLoadedInfo(info))
  } catch (e) {
    dispatch(detailedPhotoError(photoId, e as Error))
  }
}, 250)

export const loadDetailedPhoto = (photoId: string, photosetId: string) => (
  (dispatch: Dispatch, getState: () => State) => (
    loadDetailedPhotoImpl(dispatch, photoId, getState().gallery, photosetId)
  )
)
