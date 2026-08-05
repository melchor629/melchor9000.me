import type { Album, AlbumItem, Asset, AssetItem } from './types'

const apiKey = process.env.FLICKR_API_KEY
const apiUrl = 'https://api.flickr.com/services/rest/'
const userId = process.env.FLICKR_USER_ID

if (!apiKey) {
  throw new Error('Please fill FLICKR_API_KEY env var')
}

if (!userId) {
  throw new Error('Please fill FLICKR_USER_ID env var')
}

const buildUrl = (
  url: string,
  parameters: Record<string, string | number | boolean | null | undefined>,
) => {
  const queryString = new URLSearchParams(
    Object.entries(parameters)
      .filter(([, value]) => value != null)
      .map(([key, value]) => [key, value!.toString()]),
  ).toString()
  if (queryString) {
    return `${url}?${queryString}`
  }
  return url
}

class FlickrApiError extends Error {
  readonly status: number
  readonly headers: Headers
  readonly body: string

  constructor(response: Response, body: string) {
    super(`Flickr API call responded with error ${response.statusText}`)
    this.status = response.status
    this.headers = response.headers
    this.body = body
  }
}

const doRequest = async <T>(request: Record<string, unknown>): Promise<T> => {
  if (!apiKey) {
    throw new Error('Flickr API KEY is not defined')
  }

  const augmentedRequest = {
    ...request,
    api_key: apiKey,
    format: 'json',
    nojsoncallback: '1',
  }
  const url = buildUrl(apiUrl, augmentedRequest)
  const abortController = new AbortController()
  const abortHandler = setTimeout(() => abortController.abort(), 12_000)
  const response = await fetch(url, {
    headers: {
      'user-agent': 'melchor9000.me (https://github.com/melchor629/melchor9000.me)',
    },
    signal: abortController.signal,
  })
  clearTimeout(abortHandler)
  if (!response.ok) {
    throw new FlickrApiError(response, await response.text())
  }
  return response.json() as T
}

const protoFunc =
  // oxlint-disable-next-line typescript/no-unnecessary-type-parameters
  <Params extends object, DataType>(method: string) =>
    (params: Params) =>
      doRequest<DataType>({ ...(params as object), method })

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
  urls: { url: Array<{ _content: string; type: string }> }
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
  primary_photo_extras?: Partial<Record<PrimaryPhotoExtraValues, string>>
}

type PrimaryPhotoExtraValues =
  | 'license'
  | 'date_upload'
  | 'date_taken'
  | 'owner_name'
  | 'icon_server'
  | 'original_format'
  | 'last_update'
  | 'geo'
  | 'tags'
  | 'machine_tags'
  | 'o_dims'
  | 'views'
  | 'media'
  | 'path_alias'
  | 'url_sq'
  | 'url_t'
  | 'url_s'
  | 'url_m'
  | 'url_o'
interface PhotosetsGetListParams {
  user_id: string
  page?: number
  per_page?: number
  primary_photo_extras?: PrimaryPhotoExtraValues[]
  sort_groups?: string
}

interface PhotosetsGetInfoParams {
  user_id: string
  photoset_id: string
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
  label:
    | 'Square'
    | 'Large Square'
    | 'Thumbnail'
    | 'Small'
    | 'Small 320'
    | 'Medium'
    | 'Medium 640'
    | 'Medium 800'
    | 'Large'
    | 'Large 1600'
    | 'Large 2048'
    | 'Original'
  width: string | number
  height: string | number
  source: string
  url: string
  media: 'photo'
}

interface Photos {
  page: string | number
  pages: string | number
  total: string | number
  photo: Photo[]
}

interface PhotosSearchParams {
  user_id: string
  text?: string
  min_taken_date?: string | number
  max_taken_date?: string | number
  sort?: `${'date-posted' | 'date-taken' | 'interestingness'}-${'asc' | 'desc'}` | 'relevance'
  per_page?: number
  page?: number
}

const getPhotoInfo = protoFunc<PhotoGetInfoParams, { photo: PhotoInfo }>('flickr.photos.getInfo')
const getPhotoExif = protoFunc<PhotoGetInfoParams, { photo: ExifData }>('flickr.photos.getExif')
const getPhotoSizes = protoFunc<PhotoGetInfoParams, { sizes: { size: PhotoSize[] } }>(
  'flickr.photos.getSizes',
)
const searchPhotos = protoFunc<PhotosSearchParams, { photos: Photos }>('flickr.photos.search')

const getPhotosetInfo = protoFunc<PhotosetsGetInfoParams, { photoset: Photoset }>(
  'flickr.photosets.getInfo',
)
const getPhotosetList = protoFunc<PhotosetsGetListParams, { photosets: Photosets }>(
  'flickr.photosets.getList',
)

const utils = Object.freeze({
  toNumber(input: string | number | null | undefined, radix: number = 10) {
    if (input == null) {
      return 0
    }

    if (typeof input === 'string') {
      return parseInt(input.replace(',', '.'), radix)
    }

    return input
  },
  getString<T extends string | { _content: string } | undefined>(
    input: T,
  ): T extends undefined ? string | undefined : string {
    if (input == null) {
      return undefined!
    }

    return typeof input === 'string' ? input : input._content
  },
  toDate(input: string | number) {
    return new Date(this.toNumber(input) * 1000)
  },
  buildImageUrl(
    photo: { farm: number; server: string; id: string; secret: string },
    quality: 'b' = 'b',
  ) {
    return `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_${quality}.jpg`
  },
  toUrl(input: string | null | undefined) {
    if (!input) {
      return null
    }

    return new URL(input)
  },
})

export const getAlbumList = async (): Promise<AlbumItem[]> => {
  const { photosets: result } = await getPhotosetList({
    user_id: userId,
    page: 1,
    per_page: 500,
    primary_photo_extras: ['url_o'],
    sort_groups: 'date_update',
  })

  // TODO pagination?
  return result.photoset
    .map((p): AlbumItem => ({
      id: p.id,
      title: utils.getString(p.title),
      description: utils.getString(p.description),
      createdAt: utils.toDate(p.date_create),
      updatedAt: utils.toDate(p.date_update),
      coverAssetId: p.primary,
      lastPhotoTakenAt: null,
      count: utils.toNumber(p.count_photos),
    }))
    .toSorted((a, b) => +b.updatedAt - +a.updatedAt)
}

export const getAlbum = async (albumId: string): Promise<Album | null> => {
  const { photoset } = await getPhotosetInfo({
    user_id: userId,
    photoset_id: albumId,
  })

  if (!photoset || photoset.owner !== userId) {
    return null
  }

  const { photos: result } = await searchPhotos({
    user_id: process.env.FLICKR_USER_ID,
    sort: 'date-taken-desc',
    per_page: 500,
  })

  return {
    id: photoset.id,
    title: utils.getString(photoset.title),
    description: utils.getString(photoset.description),
    coverAssetId: photoset.primary,
    createdAt: utils.toDate(photoset.date_create),
    updatedAt: utils.toDate(photoset.date_update),
    lastPhotoTakenAt: null,
    count: utils.toNumber(photoset.count_photos),
    assets: result.photo
      .map((photo): AssetItem => ({
        id: photo.id,
        type: 'image',
        title: utils.getString(photo.title),
        description: '',
        createdAt: utils.toDate(photoset.date_create),
        thumbHash: null,
      }))
      .toSorted((a, b) => +b.createdAt - +a.createdAt),
  }
}

export const getAsset = async (assetId: string): Promise<Asset | null> => {
  const [{ photo }, { sizes }, { photo: exif }] = await Promise.all([
    getPhotoInfo({ photo_id: assetId }),
    getPhotoSizes({ photo_id: assetId }),
    getPhotoExif({ photo_id: assetId }),
  ])

  if (!photo || !sizes || photo.owner.nsid !== userId) {
    return null
  }

  return {
    id: photo.id,
    title: utils.getString(photo.title),
    description: utils.getString(photo.description),
    type: 'image',
    thumbHash: null,
    createdAt: new Date(photo.dates.taken),
    exif: exif
      ? {
          cameraModel: exif.camera,
          cameraMaker: utils.getString(exif.exif.find((e) => e.tag === 'Make')?.raw) || null,
          exposure: utils.getString(exif.exif.find((e) => e.tag === 'ExposureTime')?.raw) || null,
          aperture:
            utils.toNumber(utils.getString(exif.exif.find((e) => e.tag === 'FNumber')?.raw)) ||
            null,
          iso: utils.toNumber(utils.getString(exif.exif.find((e) => e.tag === 'ISO')?.raw)) || null,
          focalLength:
            utils.toNumber(utils.getString(exif.exif.find((e) => e.tag === 'FocalLength')?.raw)) ||
            null,
          exposureMode:
            utils.getString(exif.exif.find((e) => e.tag === 'ExposureMode')?.raw) || null,
          flash: utils.getString(exif.exif.find((e) => e.tag === 'Flash')?.raw) || null,
          colorSpace: utils.getString(exif.exif.find((e) => e.tag === 'ColorSpace')?.raw) || null,
          width:
            utils.toNumber(utils.getString(exif.exif.find((e) => e.tag === 'ImageWidth')?.raw)) ||
            null,
          height:
            utils.toNumber(utils.getString(exif.exif.find((e) => e.tag === 'ImageHeight')?.raw)) ||
            null,
          lensModel: null,
          orientation: photo.rotation.toString(),
        }
      : null,
    location: photo.location
      ? {
          latitude: parseFloat(photo.location.latitude),
          longitude: parseFloat(photo.location.longitude),
          city: utils.getString(photo.location.locality) || null,
          state:
            [
              utils.getString(photo.location.county) || '',
              utils.getString(photo.location.region) || '',
            ]
              .join(' ')
              .trim() || null,
          country: utils.getString(photo.location.country) || null,
        }
      : null,
  }
}

export const fetchAssetThumbnail = async (assetId: string): Promise<Blob | null> => {
  const {
    sizes: { size: sizes },
  } = await getPhotoSizes({ photo_id: assetId })
  const photoSize =
    sizes.find((p) => p.label === 'Thumbnail') ?? sizes.find((p) => p.label === 'Large')!
  const response = await fetch(photoSize.url)
  if (!response.ok) {
    return null
  }

  return response.blob()
}

export const fetchAsset = async (assetId: string): Promise<Blob | null> => {
  const {
    sizes: { size: sizes },
  } = await getPhotoSizes({ photo_id: assetId })
  const photoSize =
    sizes.find((p) => p.label === 'Original') ??
    sizes.find((p) => p.label === 'Large 2048') ??
    sizes.find((p) => p.label === 'Large 1600') ??
    sizes.find((p) => p.label === 'Large')!
  const response = await fetch(photoSize.url)
  if (!response.ok) {
    return null
  }

  return response.blob()
}
