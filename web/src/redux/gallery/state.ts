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

export const initialState: GalleryState = {
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
