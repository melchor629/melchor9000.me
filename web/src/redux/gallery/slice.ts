import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import flickr, {
  PhotosetPhotos,
  Photo,
  GalleryError,
} from '../../lib/flickr'
import { GalleryPhoto, GalleryPhotosetPhoto, initialState } from './state'

type GalleryAction<P = {}> = PayloadAction<{ photosetId: string } & P>

type LoadedPhotosAction = GalleryAction<{ photos: GalleryPhotosetPhoto[] }>
type FirstPhotosLoadedAction = GalleryAction<{
  primary: string,
  totalPhotos: number,
  photos: GalleryPhotosetPhoto[],
  primaryPhoto: GalleryPhoto,
}>
type ErrorLoadingAction = GalleryAction<{
  kind: 'not-found' | 'api' | 'other'
  message: string
}>
type DetailedLoadedInfoAction = PayloadAction<{ photoId: string, photo: GalleryPhoto }>
type DetailedErrorLoadingAction = PayloadAction<{
  kind: 'not-found' | 'api' | 'other'
  message: string
}>

const gallerySlice = createSlice({
  name: 'gallery',
  initialState,
  reducers: {
    loadedPhotos: {
      reducer: (state, action: LoadedPhotosAction) => {
        const photoset = state.photosets[action.payload.photosetId]
        if (!photoset) {
          return
        }

        photoset.loading = false
        photoset.photos = [...photoset.photos, ...action.payload.photos]
      },
      prepare: (photos: PhotosetPhotos) => ({
        payload: {
          photosetId: photos.id,
          photos: photos.photos.map((photo) => ({
            ...photo,
            url: flickr.buildPhotoUrl(photo),
          })),
        },
      }),
    },

    firstPhotosLoaded: {
      reducer: (state, { payload }: FirstPhotosLoadedAction) => {
        if (!state.photosets[payload.photosetId]) {
          state.photosets[payload.photosetId] = {} as any
        }

        const photoset = state.photosets[payload.photosetId]!
        photoset.loading = false
        photoset.primary = payload.primary
        photoset.totalPhotos = payload.totalPhotos
        photoset.photos = payload.photos

        state.photos[payload.primaryPhoto.id] = payload.primaryPhoto
      },
      prepare: (photos: PhotosetPhotos, primaryPhoto: Photo) => ({
        payload: {
          photosetId: photos.id,
          primary: photos.primary,
          totalPhotos: photos.total,
          photos: photos.photos.map((photo) => ({
            ...photo,
            url: flickr.buildPhotoUrl(photo),
          })),
          primaryPhoto: { ...primaryPhoto, url: flickr.buildPhotoUrl(primaryPhoto) },
        },
      }),
    },

    loadingPhotos: (state, { payload }: GalleryAction) => {
      if (!state.photosets[payload.photosetId]) {
        state.photosets[payload.photosetId] = {
          loading: true,
          photos: [],
          primary: null,
          totalPhotos: 0,
        }
      }

      state.photosets[payload.photosetId]!.loading = true
      state.photosets[payload.photosetId]!.error = undefined
    },

    errorLoading: {
      reducer: (state, { payload }: ErrorLoadingAction) => {
        if (!state.photosets[payload.photosetId]) {
          state.photosets[payload.photosetId] = {
            loading: false,
            photos: [],
            primary: null,
            totalPhotos: 0,
          }
        }

        state.photosets[payload.photosetId]!.loading = false
        state.photosets[payload.photosetId]!.error = payload
      },
      prepare: (photosetId: string, error: Error) => {
        if (error instanceof GalleryError) {
          if (error.response.status === 404) {
            return {
              payload: {
                photosetId,
                kind: 'not-found' as const,
                message: error.message,
              },
            }
          }

          return {
            payload: {
              photosetId,
              kind: 'api' as const,
              message: `${error.message} -- ${JSON.stringify(error.body)}`,
            },
          }
        }

        return {
          payload: {
            photosetId,
            kind: 'other' as const,
            message: error.message,
          },
        }
      },
    },

    detailedHidden: (state) => {
      state.detailed.directionOfChange = 'next'
      state.detailed.loadingInfo = false
      state.detailed.loadingPhoto = false
      state.detailed.currentPhotoId = undefined
      state.detailed.previousPhotoId = undefined
    },

    detailedLoadingInfo: (state, { payload }: PayloadAction<string>) => {
      state.detailed.loadingInfo = true
      state.detailed.loadingPhoto = true
      state.detailed.previousPhotoId = state.detailed.currentPhotoId
      state.detailed.currentPhotoId = payload
      state.detailed.imageSwitcher = !state.detailed.imageSwitcher
      state.detailed.error = undefined
    },

    detailedLoadedInfo: {
      reducer: (state, { payload }: DetailedLoadedInfoAction) => {
        if (!state.detailed.currentPhotoId) {
          return
        }

        state.detailed.loadingInfo = false
        state.detailed.zoomEnabled = false

        state.photos[payload.photoId] = payload.photo
      },
      prepare: (photo: Photo) => ({
        payload: {
          photoId: photo.id,
          photo: { ...photo, url: flickr.buildPhotoUrl(photo) },
        },
      }),
    },

    detailedChangePhoto: (state, { payload }: PayloadAction<string>) => {
      state.detailed.loadingPhoto = true
      state.detailed.previousPhotoId = state.detailed.currentPhotoId
      state.detailed.currentPhotoId = payload
      state.detailed.imageSwitcher = !state.detailed.imageSwitcher
      state.detailed.error = undefined
    },

    detailedPhotoLoaded: (state) => {
      state.detailed.loadingPhoto = false
    },

    detailedPhotoError: {
      reducer: (state, { payload }: DetailedErrorLoadingAction) => {
        state.detailed.loadingInfo = false
        state.detailed.loadingPhoto = false
        state.detailed.error = payload
      },
      prepare: (photoId: string, error?: Error) => {
        if (!error) {
          return {
            payload: {
              photoId,
              kind: 'not-found' as const,
              message: `Photo with ID ${photoId} does not exist`,
            },
          }
        }

        if (error instanceof GalleryError) {
          if (error.response.status === 404) {
            return {
              payload: {
                photoId,
                kind: 'not-found' as const,
                message: error.message,
              },
            }
          }

          return {
            payload: {
              photoId,
              kind: 'api' as const,
              message: `${error.message} -- ${JSON.stringify(error.body)}`,
            },
          }
        }

        return {
          payload: {
            photoId,
            kind: 'other' as const,
            message: error.message,
          },
        }
      },
    },

    detailedPhotoIsGoingToChange: (state, { payload }: PayloadAction<'next' | 'prev'>) => {
      // TODO ???
      state.detailed.directionOfChange = payload
    },
  },
})

export default gallerySlice
