import { Action, Dispatch } from 'redux'
import { debounce } from 'debounce'

import flickr, {
  PhotosetPhoto,
  PhotosetPhotos,
  Photo,
  GalleryError,
} from '../../lib/flickr'
import type { GalleryState, GalleryPhotosetPhoto, GalleryPhoto } from './reducers'
import type { State } from '../reducers'

export const PHOTOSET_FIRST_PHOTOS_LOADED = 'gallery:photoset:first-photos-loaded'
export const PHOTOSET_LOADING_PHOTOS = 'gallery:photoset:loading-photos'
export const PHOTOSET_LOADED_PHOTOS = 'gallery:photoset:loaded-photos'
export const PHOTOSET_ERROR_LOADING = 'gallery:photoset:error'
export const DETAILED_HIDDEN = 'gallery:detailed:hidden'
export const DETAILED_LOADING_INFO = 'gallery:detailed:loading-info'
export const DETAILED_LOADED_INFO = 'gallery:detailed:loaded-info'
export const DETAILED_CHANGE_PHOTO = 'gallery:detailed:change-photo'
export const DETAILED_PHOTO_LOADED = 'gallery:detailed:photo-loaded'
export const DETAILED_PHOTO_ERROR = 'gallery:detailed:photo-error'
export const DETAILED_PHOTO_IS_GOING_TO_CHANGE = 'gallery:detailed:transition'

const howMuchToLoad = 500

interface PhotosetFirstPhotosLoadedAction extends Action<typeof PHOTOSET_FIRST_PHOTOS_LOADED> {
  photosetId: string
  primary: string
  totalPhotos: number
  photos: GalleryPhotosetPhoto[]
  primaryPhoto: GalleryPhoto,
}

const photosetFirstPhotosLoaded = (
  photos: PhotosetPhotos,
  primaryPhoto: Photo,
): PhotosetFirstPhotosLoadedAction => ({
  type: PHOTOSET_FIRST_PHOTOS_LOADED,
  photosetId: photos.id,
  primary: photos.primary,
  totalPhotos: photos.total,
  photos: photos.photos.map((photo) => ({
    ...photo,
    url: flickr.buildPhotoUrl(photo),
  })),
  primaryPhoto: { ...primaryPhoto, url: flickr.buildPhotoUrl(primaryPhoto) },
})

interface PhotosetLoadedPhotosAction extends Action<typeof PHOTOSET_LOADED_PHOTOS> {
  photosetId: string
  photos: GalleryPhotosetPhoto[]
}

const photosetLoadedPhotos = (photos: PhotosetPhotos): PhotosetLoadedPhotosAction => ({
  type: PHOTOSET_LOADED_PHOTOS,
  photosetId: photos.id,
  photos: photos.photos.map((photo) => ({
    ...photo,
    url: flickr.buildPhotoUrl(photo),
  })),
})

interface PhotosetErrorLoadingAction extends Action<typeof PHOTOSET_ERROR_LOADING> {
  photosetId: string
  kind: 'not-found' | 'api' | 'other'
  message: string
}

const photosetErrorLoading = (photosetId: string, error: Error): PhotosetErrorLoadingAction => {
  if (error instanceof GalleryError) {
    if (error.response.status === 404) {
      return {
        type: PHOTOSET_ERROR_LOADING,
        photosetId,
        kind: 'not-found',
        message: error.message,
      }
    }

    return {
      type: PHOTOSET_ERROR_LOADING,
      photosetId,
      kind: 'api',
      message: `${error.message} -- ${JSON.stringify(error.body)}`,
    }
  }

  return {
    type: PHOTOSET_ERROR_LOADING,
    photosetId,
    kind: 'other',
    message: error.message,
  }
}

interface DetailedPhotoIsGoingToChange extends Action<typeof DETAILED_PHOTO_IS_GOING_TO_CHANGE> {
  direction: 'next' | 'prev'
}

export const nextDetailed = (): DetailedPhotoIsGoingToChange => ({
  type: DETAILED_PHOTO_IS_GOING_TO_CHANGE,
  direction: 'next',
})

export const prevDetailed = (): DetailedPhotoIsGoingToChange => ({
  type: DETAILED_PHOTO_IS_GOING_TO_CHANGE,
  direction: 'prev',
})

type DetailedHiddenAction = Action<typeof DETAILED_HIDDEN>

export const hideDetailed = () => (dispatch: Dispatch<DetailedHiddenAction>) => {
  dispatch({ type: DETAILED_HIDDEN })
}

interface DetailedLoadingInfoAction extends Action<typeof DETAILED_LOADING_INFO> {
  photoId: string
}

const detailedLoadingInfo = (photoId: string): DetailedLoadingInfoAction => ({
  type: DETAILED_LOADING_INFO,
  photoId,
})

interface DetailedLoadedInfoAction extends Action<typeof DETAILED_LOADED_INFO> {
  photoId: string
  photo: GalleryPhoto
}

const detailedLoadedInfo = (photo: Photo): DetailedLoadedInfoAction => ({
  type: DETAILED_LOADED_INFO,
  photoId: photo.id,
  photo: { ...photo, url: flickr.buildPhotoUrl(photo) },
})

type DetailedPhotoLoaded = Action<typeof DETAILED_PHOTO_LOADED>

export const detailedPhotoLoaded = (): DetailedPhotoLoaded => ({ type: DETAILED_PHOTO_LOADED })

interface DetailedChangePhotoAction extends Action<typeof DETAILED_CHANGE_PHOTO> {
  photoId: string
}

const changeToPhotoDetail = (photoId: string): DetailedChangePhotoAction => ({
  type: DETAILED_CHANGE_PHOTO,
  photoId,
})

interface DetailedPhotoErrorAction extends Action<typeof DETAILED_PHOTO_ERROR> {
  photoId: string
  kind: 'not-found' | 'api' | 'other'
  message: string
}

const detailedPhotoError = (photoId: string, error?: Error): DetailedPhotoErrorAction => {
  if (!error) {
    return {
      type: DETAILED_PHOTO_ERROR,
      photoId,
      kind: 'not-found',
      message: `Photo with ID ${photoId} does not exist`,
    }
  }

  if (error instanceof GalleryError) {
    if (error.response.status === 404) {
      return {
        type: DETAILED_PHOTO_ERROR,
        photoId,
        kind: 'not-found',
        message: error.message,
      }
    }

    return {
      type: DETAILED_PHOTO_ERROR,
      photoId,
      kind: 'api',
      message: `${error.message} -- ${JSON.stringify(error.body)}`,
    }
  }

  return {
    type: DETAILED_PHOTO_ERROR,
    photoId,
    kind: 'other',
    message: error.message,
  }
}

interface PhotosetLoadingPhotos extends Action<typeof PHOTOSET_LOADING_PHOTOS> {
  photosetId: string
}

const loadingMorePhotos = (photosetId: string): PhotosetLoadingPhotos => ({
  type: PHOTOSET_LOADING_PHOTOS,
  photosetId,
})

export const loadFirstPhotos = (photosetId: string) => (
  async (dispatch: Dispatch, getState: () => State) => {
    if (getState().galleryList.photosets[photosetId]?.photos.length) {
      return
    }

    try {
      const photoset = await flickr.photosets.getPhotos(photosetId, {
        perPage: howMuchToLoad,
        page: 1,
      })
      const primaryPhoto = getState().galleryList.photos[photoset.primary]
        || await flickr.photos.getInfo(photoset.primary)
      dispatch(photosetFirstPhotosLoaded({
        ...photoset,
        primary: primaryPhoto.sizes.find((s) => s.label === 'Large')!.source,
      }, primaryPhoto))
    } catch (e) {
      dispatch(photosetErrorLoading(photosetId, e as Error))
    }
  }
)

export const loadMorePhotos = (
  photosetId: string,
) => async (dispatch: Dispatch, getState: () => State) => {
  const { galleryList: { photosets } } = getState()
  const storedPhotoset = photosets[photosetId]
  if (!storedPhotoset) {
    return
  }

  const { totalPhotos, photos: loadedPhotos } = storedPhotoset
  if (totalPhotos === loadedPhotos.length) {
    return
  }

  dispatch(loadingMorePhotos(photosetId))

  try {
    const photoset = await flickr.photosets.getPhotos(photosetId, {
      perPage: howMuchToLoad,
      page: Math.floor(loadedPhotos.length / howMuchToLoad) + 1,
    })
    dispatch(photosetLoadedPhotos(photoset))
  } catch (e) {
    dispatch(photosetErrorLoading(photosetId, e as Error))
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
    dispatch(changeToPhotoDetail(photoId))
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
      dispatch(photosetFirstPhotosLoaded({
        id: photosetId,
        owner,
        page: Math.floor(photosList.length + (photoset?.photos.length ?? 0)) / howMuchToLoad,
        pages,
        photos: photosList,
        primary: primaryPhoto.sizes.find((s) => s.label === 'Large')!.source,
        total: totalPhotos,
      }, primaryPhoto))
    } else if (photosList.length > 0) {
      dispatch(photosetLoadedPhotos({
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
    dispatch(photosetErrorLoading(photosetId, e as Error))
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
    loadDetailedPhotoImpl(dispatch, photoId, getState().galleryList, photosetId)
  )
)

export type GalleryActions = PhotosetFirstPhotosLoadedAction |
PhotosetLoadedPhotosAction |
PhotosetErrorLoadingAction |
DetailedPhotoIsGoingToChange |
DetailedHiddenAction |
DetailedLoadingInfoAction |
DetailedLoadedInfoAction |
DetailedPhotoLoaded |
DetailedPhotoErrorAction |
PhotosetLoadingPhotos |
DetailedChangePhotoAction
