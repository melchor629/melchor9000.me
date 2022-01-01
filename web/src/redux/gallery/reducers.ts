import {
  DETAILED_PHOTO_IS_GOING_TO_CHANGE,
  PHOTOSET_FIRST_PHOTOS_LOADED,
  GalleryActions,
  DETAILED_HIDDEN,
  DETAILED_LOADED_INFO,
  DETAILED_PHOTO_LOADED,
  PHOTOSET_LOADING_PHOTOS,
  DETAILED_CHANGE_PHOTO,
  DETAILED_LOADING_INFO,
  PHOTOSET_LOADED_PHOTOS,
  PHOTOSET_ERROR_LOADING,
  DETAILED_PHOTO_ERROR,
} from './actions'
import { Photo, PhotosetPhoto } from '../../lib/flickr'

export interface GalleryPhoto extends Photo {
  url: string
}

export interface GalleryPhotosetPhoto extends PhotosetPhoto {
  url: string
}

interface GalleryPhotoset {
  primary: string | null
  totalPhotos: number
  photos: GalleryPhotosetPhoto[]
  loading: boolean
  error?: { kind: 'not-found' | 'api' | 'other', message: string }
}

interface GalleryDetailedState {
  currentPhotoId?: string
  previousPhotoId?: string
  zoomEnabled: boolean
  imageSwitcher: boolean
  directionOfChange: 'next' | 'prev'
  loadingInfo: boolean
  loadingPhoto: boolean
  error?: { kind: 'not-found' | 'api' | 'other', message: string }
}

export interface GalleryState {
  photosets: { [P in string]?: GalleryPhotoset }
  photos: { [P in string]?: GalleryPhoto }
  detailed: GalleryDetailedState
}

const initialState: GalleryState = {
  photosets: {},
  photos: {},
  detailed: {
    directionOfChange: 'next',
    imageSwitcher: true,
    loadingInfo: false,
    loadingPhoto: false,
    zoomEnabled: false,
  },
}

export const galleryList = (
  // eslint-disable-next-line @typescript-eslint/default-param-last
  state: GalleryState = initialState,
  action: GalleryActions,
): GalleryState => {
  switch (action.type) {
    case PHOTOSET_LOADED_PHOTOS: {
      const photoset = state.photosets[action.photosetId]
      if (!photoset) {
        return state
      }

      return {
        ...state,
        photosets: {
          ...state.photosets,
          [action.photosetId]: {
            ...photoset,
            loading: false,
            photos: [...photoset.photos, ...action.photos],
          },
        },
      }
    }

    case PHOTOSET_FIRST_PHOTOS_LOADED: {
      const photoset = state.photosets[action.photosetId] || {}

      return {
        ...state,
        photosets: {
          ...state.photosets,
          [action.photosetId]: {
            ...photoset,
            loading: false,
            primary: action.primary,
            totalPhotos: action.totalPhotos,
            photos: action.photos,
          },
        },
        photos: {
          ...state.photos,
          [action.primaryPhoto.id]: action.primaryPhoto,
        },
      }
    }

    case PHOTOSET_LOADING_PHOTOS:
      return {
        ...state,
        photosets: {
          ...state.photosets,
          [action.photosetId]: {
            ...(
              state.photosets[action.photosetId] || { photos: [], primary: null, totalPhotos: 0 }
            ),
            loading: true,
            error: undefined,
          },
        },
      }

    case PHOTOSET_ERROR_LOADING: {
      const photoset = state.photosets[action.photosetId] || {
        loading: false,
        photos: [],
        totalPhotos: 0,
        primary: null,
      }

      return {
        ...state,
        photosets: {
          ...state.photosets,
          [action.photosetId]: {
            ...photoset,
            error: {
              kind: action.kind,
              message: action.message,
            },
          },
        },
      }
    }

    case DETAILED_HIDDEN:
      return {
        ...state,
        detailed: {
          ...state.detailed,
          directionOfChange: 'next',
          loadingInfo: false,
          loadingPhoto: false,
          currentPhotoId: undefined,
          previousPhotoId: undefined,
        },
      }

    case DETAILED_LOADING_INFO:
      return {
        ...state,
        detailed: {
          ...state.detailed,
          loadingPhoto: true,
          loadingInfo: true,
          currentPhotoId: action.photoId,
          previousPhotoId: state.detailed.currentPhotoId,
          imageSwitcher: !state.detailed.imageSwitcher,
          error: undefined,
        },
      }

    case DETAILED_LOADED_INFO: {
      if (!state.detailed.currentPhotoId) {
        return state
      }

      return {
        ...state,
        detailed: {
          ...state.detailed,
          loadingInfo: false,
          zoomEnabled: false,
        },
        photos: {
          ...state.photos,
          [action.photoId]: action.photo,
        },
      }
    }

    case DETAILED_CHANGE_PHOTO: {
      return {
        ...state,
        detailed: {
          ...state.detailed,
          loadingPhoto: true,
          currentPhotoId: action.photoId,
          previousPhotoId: state.detailed.currentPhotoId,
          imageSwitcher: !state.detailed.imageSwitcher,
          error: undefined,
        },
      }
    }

    case DETAILED_PHOTO_LOADED:
      return {
        ...state,
        detailed: {
          ...state.detailed,
          loadingPhoto: false,
        },
      }

    case DETAILED_PHOTO_ERROR: {
      return {
        ...state,
        detailed: {
          ...state.detailed,
          loadingPhoto: false,
          loadingInfo: false,
          error: {
            kind: action.kind,
            message: action.message,
          },
        },
      }
    }

    case DETAILED_PHOTO_IS_GOING_TO_CHANGE: {
      // TODO ???
      return {
        ...state,
        detailed: {
          ...state.detailed,
          directionOfChange: action.direction,
        },
      }
    }

    default: return state
  }
}
