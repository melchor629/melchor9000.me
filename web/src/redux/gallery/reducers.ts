import {
  DETAILED_PHOTO_IS_GOING_TO_CHANGE,
  FIRST_PHOTOS_LOADED,
  GalleryActions,
  HIDDEN_DETAILED,
  LOADED_PHOTO_DETAIL,
  LOADED_PHOTO_IMAGE,
  LOADING_MORE_PHOTOS,
  CHANGE_TO_PHOTO_DETAIL,
  LOADING_PHOTO_DETAIL,
  MORE_PHOTOS_LOADED,
} from './actions'
import { Photo, PhotosetPhoto } from '../../lib/flickr'

export interface GalleryPhoto extends Photo {
  url: string
  zoomUrl?: string
  zoomSize?: { w: number, h: number }
}

export interface GalleryPhotosetPhoto extends PhotosetPhoto {
  url: string
}

interface GalleryPhotoset {
  primary: string | null
  totalPhotos: number
  photos: GalleryPhotosetPhoto[]
  loading: boolean
}

interface GalleryDetailedState {
  currentPhotoId?: string
  previousPhotoId?: string
  zoomEnabled: boolean
  imageSwitcher: boolean
  directionOfChange: 'next' | 'prev'
  loadingInfo: boolean
  loadingPhoto: boolean
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
  state: GalleryState = initialState,
  action: GalleryActions,
): GalleryState => {
  switch (action.type) {
    case MORE_PHOTOS_LOADED: {
      const photoset = state.photosets[action.photosetId]
      if (!photoset) {
        return state
      }

      return {
        ...state,
        photosets: {
          [action.photosetId]: {
            ...photoset,
            loading: false,
            photos: [...photoset.photos, ...action.photos],
          },
        },
      }
    }

    case FIRST_PHOTOS_LOADED: {
      const photoset = state.photosets[action.photosetId] || {}

      return {
        ...state,
        photosets: {
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

    case LOADING_MORE_PHOTOS:
      return {
        ...state,
        photosets: {
          [action.photosetId]: {
            ...(
              state.photosets[action.photosetId] || { photos: [], primary: null, totalPhotos: 0 }
            ),
            loading: true,
          },
        },
      }

    case HIDDEN_DETAILED:
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

    case LOADING_PHOTO_DETAIL:
      return {
        ...state,
        detailed: {
          ...state.detailed,
          loadingPhoto: true,
          loadingInfo: true,
          currentPhotoId: action.photoId,
          previousPhotoId: state.detailed.currentPhotoId,
          imageSwitcher: !state.detailed.imageSwitcher,
        },
      }

    case LOADED_PHOTO_DETAIL: {
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

    case CHANGE_TO_PHOTO_DETAIL: {
      return {
        ...state,
        detailed: {
          ...state.detailed,
          loadingPhoto: true,
          currentPhotoId: action.photoId,
          previousPhotoId: state.detailed.currentPhotoId,
          imageSwitcher: !state.detailed.imageSwitcher,
        },
      }
    }

    case LOADED_PHOTO_IMAGE:
      return {
        ...state,
        detailed: {
          ...state.detailed,
          loadingPhoto: false,
        },
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
