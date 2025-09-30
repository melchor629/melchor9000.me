export type AssetType = 'image' | 'audio' | 'video' | 'other'

export type AssetExif = {
  cameraMaker: string | null
  cameraModel: string | null
  width: number | null
  height: number | null
  orientation: string | null
  lensModel: string | null
  exposure: string | null
  aperture: number | null
  focalLength: number | null
  iso: number | null
  exposureMode: string | null
  flash: string | null
  colorSpace: string | null
}

export type AssetLocation = {
  latitude: number | string
  longitude: number | string
  city: string | null
  state: string | null
  country: string | null
}

export type AssetItem = {
  id: string
  title: string
  description: string
  type: AssetType
  thumbHash: string | null
  createdAt: Date
}

export type Asset = AssetItem & {
  exif: AssetExif | null
  location: AssetLocation | null
}

export type AlbumItem = {
  id: string
  title: string
  description: string
  coverAssetId: string | null
  createdAt: Date
  updatedAt: Date
  lastPhotoTakenAt: Date | null
  count: number
}

export type Album = AlbumItem & {
  assets: AssetItem[]
}
