import { Action, Dispatch } from 'redux'
import { debounce } from 'debounce'

import flickr, {
  PhotosetPhoto,
  PhotosetPhotos,
  Photo,
} from '../../lib/flickr'
import type { GalleryState, GalleryPhotosetPhoto, GalleryPhoto } from './reducers'
import type { State } from '../reducers'

export const FIRST_PHOTOS_LOADED = 'gallery:photoset:first-photos-loaded'
export const LOADING_MORE_PHOTOS = 'gallery:photoset:loading-photos'
export const MORE_PHOTOS_LOADED = 'gallery:photoset:loaded-photos'
export const HIDDEN_DETAILED = 'gallery:detailed:hidden'
export const LOADING_PHOTO_DETAIL = 'gallery:detailed:loading-info'
export const LOADED_PHOTO_DETAIL = 'gallery:detailed:loaded-info'
export const CHANGE_TO_PHOTO_DETAIL = 'gallery:detailed:change'
export const LOADED_PHOTO_IMAGE = 'gallery:detailed:photo-loaded'
export const DETAILED_PHOTO_IS_GOING_TO_CHANGE = 'gallery:detailed:transition'

const howMuchToLoad = 500

interface FirstPhotosLoadedAction extends Action<typeof FIRST_PHOTOS_LOADED> {
  photosetId: string
  primary: string
  totalPhotos: number
  photos: GalleryPhotosetPhoto[]
  primaryPhoto: GalleryPhoto,
}

export const firstPhotosLoaded = (
  photos: PhotosetPhotos,
  primaryPhoto: Photo,
): FirstPhotosLoadedAction => ({
  type: FIRST_PHOTOS_LOADED,
  photosetId: photos.id,
  primary: photos.primary,
  totalPhotos: photos.total,
  photos: photos.photos.map((photo) => ({
    ...photo,
    url: flickr.buildPhotoUrl(photo),
  })),
  primaryPhoto: { ...primaryPhoto, url: flickr.buildPhotoUrl(primaryPhoto) },
})

interface MorePhotosLoadedAction extends Action<typeof MORE_PHOTOS_LOADED> {
  photosetId: string
  photos: GalleryPhotosetPhoto[]
}

export const morePhotosLoaded = (photos: PhotosetPhotos): MorePhotosLoadedAction => ({
  type: MORE_PHOTOS_LOADED,
  photosetId: photos.id,
  photos: photos.photos.map((photo) => ({
    ...photo,
    url: flickr.buildPhotoUrl(photo),
  })),
})

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

type HiddenDetailed = Action<typeof HIDDEN_DETAILED>

export const hideDetailed = () => (dispatch: Dispatch<HiddenDetailed>) => {
  dispatch({ type: HIDDEN_DETAILED })
}

interface LoadingPhotoDetail extends Action<typeof LOADING_PHOTO_DETAIL> {
  photoId: string
}

export const loadingPhotoDetail = (photoId: string): LoadingPhotoDetail => ({
  type: LOADING_PHOTO_DETAIL,
  photoId,
})

interface LoadedPhotoDetail extends Action<typeof LOADED_PHOTO_DETAIL> {
  photoId: string
  photo: GalleryPhoto
}

export const loadedPhotoDetail = (photo: Photo): LoadedPhotoDetail => ({
  type: LOADED_PHOTO_DETAIL,
  photoId: photo.id,
  photo: { ...photo, url: flickr.buildPhotoUrl(photo) },
})

type LoadedPhotoImage = Action<typeof LOADED_PHOTO_IMAGE>

export const loadedPhotoImage = (): LoadedPhotoImage => ({ type: LOADED_PHOTO_IMAGE })

interface ChangeToPhotoDetail extends Action<typeof CHANGE_TO_PHOTO_DETAIL> {
  photoId: string
}

const changeToPhotoDetail = (photoId: string): ChangeToPhotoDetail => ({
  type: CHANGE_TO_PHOTO_DETAIL,
  photoId,
})

interface LoadingMorePhotos extends Action<typeof LOADING_MORE_PHOTOS> {
  photosetId: string
}

const loadingMorePhotos = (photosetId: string): LoadingMorePhotos => ({
  type: LOADING_MORE_PHOTOS,
  photosetId,
})

export const loadFirstPhotos = (photosetId: string) => (
  async (dispatch: Dispatch, getState: () => State) => {
    if (getState().galleryList.photosets[photosetId]?.photos.length) {
      return
    }

    const photoset = await flickr.photosets.getPhotos(photosetId, {
      perPage: howMuchToLoad,
      page: 1,
    })
    const primaryPhoto = getState().galleryList.photos[photoset.primary]
      || await flickr.photos.getInfo(photoset.primary)
    dispatch(firstPhotosLoaded({
      ...photoset,
      primary: primaryPhoto.sizes.find((s) => s.label === 'Large')!.source,
    }, primaryPhoto))
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

  const photoset = await flickr.photosets.getPhotos(photosetId, {
    perPage: howMuchToLoad,
    page: Math.floor(loadedPhotos.length / howMuchToLoad) + 1,
  })
  dispatch(morePhotosLoaded(photoset))
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

  dispatch(loadingPhotoDetail(photoId))
  const photoset = state.photosets[photosetId]
  const isFirstLoad = !photoset?.photos.length
  const photosList: PhotosetPhoto[] = []
  let totalPhotos = isFirstLoad || !photoset ? 1 : photoset.totalPhotos
  let primary: string = ''
  let owner = ''
  let pages = 0
  const countPhotos = () => photosList.length + (photoset?.photos.length ?? 0)
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
    dispatch(morePhotosLoaded({
      id: photosetId,
      owner,
      pages,
      page: Math.floor(photosList.length + (photoset?.photos.length ?? 0)) / howMuchToLoad,
      photos: photosList,
      primary: '',
      total: totalPhotos,
    }))
  }

  const photo = photoset?.photos.find((p) => p.id === photoId)
    || photosList.find((p) => p.id === photoId)
  if (!photo) {
    // TODO not found
    return
  }

  const info = await flickr.photos.getInfo(photoId)
  dispatch(loadedPhotoDetail(info))
}, 250)

export const loadDetailedPhoto = (photoId: string, photosetId: string) => (
  (dispatch: Dispatch, getState: () => State) => (
    loadDetailedPhotoImpl(dispatch, photoId, getState().galleryList, photosetId)
  )
)

export type GalleryActions = FirstPhotosLoadedAction |
MorePhotosLoadedAction |
DetailedPhotoIsGoingToChange |
HiddenDetailed |
LoadingPhotoDetail |
LoadedPhotoDetail |
LoadedPhotoImage |
(Action<typeof LOADING_MORE_PHOTOS> & { photosetId: string }) |
ChangeToPhotoDetail
