import * as functions from 'firebase-functions'
import got from 'got'

const apiKey = functions.config().flickr.api_key
const apiUrl = 'https://api.flickr.com/services/rest/'

const buildUrl = (url: string, parameters: Record<string, string>) => {
  const queryString = new URLSearchParams(parameters).toString()
  if (queryString) {
    return `${url}?${queryString}`
  }
  return url
}

const doRequest = async <T>(request: any): Promise<T> => {
  const augmentedRequest = {
    ...request,
    api_key: apiKey,
    format: 'json',
    nojsoncallback: '1',
  }
  const url = buildUrl(apiUrl, augmentedRequest)
  const response = await got<T>(url, { responseType: 'json' })
  return response.body
}

const protoFunc = <Params extends object, DataType>(method: string) => (
  (params: Params) => doRequest<DataType>({ ...(params as object), method })
)

interface Photo {
  id: string
  secret: string
  server: string
  farm: number
  owner: { nsid: string }
  title: string | { _content: string }
  isprimary: number | string
  ispublic: number | string
  isfriend: number | string
  isfamily: number | string
}

interface PhotoInfoLocationPlace {
  _content: string
  place_id?: string
  woeid?: string
}

interface PhotoInfo extends Photo {
  description: { _content: string }
  rotation: number | string
  urls: { url: Array<{ _content: string, type: string }> }
  dates: {
    posted: string
    taken: string
    takengranularity: number
    takenunknown: number
    lastupdate: string
  }
  location?: {
    latitude: string
    longitude: string
    accuracy: string
    context: string
    neighbourhood?: PhotoInfoLocationPlace
    locality?: PhotoInfoLocationPlace
    county?: PhotoInfoLocationPlace
    region?: PhotoInfoLocationPlace
    country?: PhotoInfoLocationPlace
    place_id?: string
    woeid?: string
  }
}

interface PhotosetPhotos {
  id: string
  primary: string
  owner: string
  photo: Photo[]
  page: number
  pages: number
  total: string
}

interface Photosets {
  page: number
  pages: number
  total: number
  photoset: Photoset[]
}

interface Photoset {
  id: string
  owner: string
  username: string
  primary: string
  secret: string
  server: string
  farm: number
  count_views: number | string
  count_comments: number | string
  count_photos: number | string
  count_videos: number | string
  title: {
    _content: string
  }
  description: {
    _content: string
  }
  can_comment: 0 | 1
  date_create: string
  date_update: string
  photos: string
  videos: number
}

interface PhotosetsGetListParams {
  user_id: string
  page?: number
  per_page?: number
  primary_photo_extras?: string
}

interface PhotosetsGetInfoParams {
  user_id: string
  photoset_id: string
}

interface PhotosetsGetPhotosParams {
  photoset_id: string
  user_id: string
  extras?: string
  privacy_filter?: 1 | 2 | 3 | 4 | 5
  per_page?: number
  page?: number
  media?: 'all' | 'photos' | 'videos'
}

interface PhotoGetInfoParams {
  photo_id: string
  secret?: string
}

interface ExifData {
  id: string
  secret: string
  server: string
  farm: number
  camera: string
  exif: Array<{
    tagspace: string
    tagspaceid: number
    tag: string
    label: string
    raw: { _content: string }
    clean?: { _content: string }
  }>
}

interface PhotoSize {
  label: 'Square' | 'Large Square' | 'Thumbnail' | 'Small' | 'Small 320' | 'Medium' | 'Medium 640' | 'Medium 800' |
  'Large' | 'Large 1600' | 'Large 2048' | 'Original'
  width: string | number
  height: string | number
  source: string
  url: string
  media: 'photo'
}

interface PeopleGetPublicPhotosParams {
  user_id: string
  per_page?: number
  page?: number
  extras?: string
}

interface Photos {
  page: string | number
  pages: string | number
  total: string | number
  photo: Photo[]
}

export const photos = {
  getInfo: protoFunc<PhotoGetInfoParams, { photo: PhotoInfo }>('flickr.photos.getInfo'),
  getExif: protoFunc<PhotoGetInfoParams, { photo: ExifData }>('flickr.photos.getExif'),
  getSizes: protoFunc<PhotoGetInfoParams, { sizes: { size: PhotoSize[] } }>('flickr.photos.getSizes'),
}

export const photosets = {
  getPhotos: protoFunc<PhotosetsGetPhotosParams, { photoset: PhotosetPhotos }>('flickr.photosets.getPhotos'),
  getInfo: protoFunc<PhotosetsGetInfoParams, { photoset: Photoset }>('flickr.photosets.getInfo'),
  getList: protoFunc<PhotosetsGetListParams, { photosets: Photosets }>('flickr.photosets.getList'),
}

export const people = {
  getPublicPhotos: protoFunc<PeopleGetPublicPhotosParams, { photos: Photos }>('flickr.people.getPublicPhotos'),
}
