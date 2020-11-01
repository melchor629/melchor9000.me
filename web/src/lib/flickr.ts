import { DateTime } from 'luxon'
import firebaseFunction from './firebase-function'

interface Photoset {
  id: string
  owner: string
  username: string
  primary: string
  secret: string
  server: string
  farm: string
  counts: {
    views: number
    comments: number
    photos: number
    videos: number
  }
  title: string
  description: string
  dateCreated: DateTime
  dateUpdated: DateTime
}

interface PhotosetList {
  page: number
  pages: number
  total: number
  photosets: Photoset[]
}

export interface PhotosetPhoto {
  id: string
  secret: string
  server: string
  farm: string
  title: string
}

export interface PhotosetPhotos {
  page: number
  pages: number
  total: number
  id: string
  primary: string
  owner: string
  photos: PhotosetPhoto[]
}

type ExifNamespaces = 'IFD0' | 'ExifIFD' | 'IPTC' | 'Photoshop' | 'XMP-x' | 'XMP-aux' | 'XMP-crd' |
'XMP-dc' | 'XMP-exifEX' | 'XMP-photoshop' | 'XMP-xmp' | 'XMP-xmpMM'

interface ExifData {
  label: string
  value: string
  clean?: string
}

interface PhotoSize {
  label: 'Square' | 'Large Square' | 'Thumbnail' | 'Small' | 'Small 320' | 'Medium' | 'Medium 640' | 'Medium 800' |
  'Large' | 'Large 1600' | 'Large 2048' | 'Original'
  width: number
  height: number
  source: string
  url: string
}

export interface Photo {
  // photo
  id: string
  secret: string
  server: string
  farm: number
  title: string
  description: string
  rotation: number
  urls: Array<{ type: string, url: string }>
  datePosted: DateTime
  dateUpdated: DateTime
  dateTaken: DateTime
  location?: {
    latitude: number
    longitude: number
    accuracy: number
    context?: string
    neighbourhood?: string
    locality?: string
    county?: string
    region?: string
    country?: string
    place_id: string
    woeid: string
  }
  // exif
  camera: string
  exif: { [tagspace in ExifNamespaces]?: { [tag in string]?: ExifData } }
  // sizes
  sizes: PhotoSize[]
}

class GalleryError extends Error {
  public body: any

  constructor(public readonly response: Response, message?: string) {
    super(message)
  }
}

const throwIfUnsuccess = async (res: Response): Promise<void> => {
  if (!res.ok) {
    const error = new GalleryError(res, `Response is not ok: ${res.statusText} (${res.status})`)
    if (res.headers.get('Content-Type')?.includes('application/json')) {
      error.body = await res.json()
    } else {
      error.body = await res.text()
    }

    throw error
  }
}

const photos = {
  getInfo: async (photoId: string): Promise<Photo> => {
    const url = firebaseFunction.gallery(`/photos/${photoId}`)
    const res = await fetch(url)
    await throwIfUnsuccess(res)
    const photo: Photo = await res.json()
    return {
      ...photo,
      datePosted: DateTime.fromISO(photo.datePosted as unknown as string),
      dateUpdated: DateTime.fromISO(photo.dateUpdated as unknown as string),
      dateTaken: DateTime.fromFormat(
        photo.dateTaken as unknown as string,
        'yyyy-MM-dd HH:mm:ss',
        { zone: 'Europe/Madrid' },
      ),
    }
  },
}

const photosets = {
  get: async (): Promise<PhotosetList> => {
    const url = firebaseFunction.gallery('/photosets')
    const res = await fetch(url)
    await throwIfUnsuccess(res)
    const list: PhotosetList = await res.json()
    return {
      ...list,
      photosets: list.photosets.map((p) => ({
        ...p,
        dateCreated: DateTime.fromISO(p.dateCreated as unknown as string),
        dateUpdated: DateTime.fromISO(p.dateUpdated as unknown as string),
      })),
    }
  },
  getInfo: async (photosetId: string): Promise<Photoset> => {
    const url = firebaseFunction.gallery(`/photosets/${encodeURIComponent(photosetId)}`)
    const res = await fetch(url)
    await throwIfUnsuccess(res)
    const photoset = await res.json()
    return {
      ...photoset,
      dateCreated: DateTime.fromISO(photoset.dateCreated),
      dateUpdated: DateTime.fromISO(photoset.dateUpdated),
    }
  },
  getPhotos: async (
    photosetId: string,
    params: { page: number, perPage: number },
  ): Promise<PhotosetPhotos> => {
    const query = new URLSearchParams({
      page: params.page.toString(),
      perPage: params.perPage.toString(),
    }).toString()
    const url = firebaseFunction.gallery(`/photosets/${encodeURIComponent(photosetId)}/photos?${query}`)
    const res = await fetch(url)
    await throwIfUnsuccess(res)
    return res.json()
  },
}

export default {
  photos,
  photosets,
  buildThumbnailUrl: (photo: Photo | PhotosetPhoto) => `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_q.jpg`,
  buildPhotoUrl: (photo: Photo | PhotosetPhoto) => `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}.jpg`,
  buildLargePhotoUrl: (photo: Photo | PhotosetPhoto) => `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_b.jpg`,
}
