import {
  AssetMediaSize,
  init,
  downloadAsset,
  getAlbumInfo,
  getAllAlbums,
  getAssetInfo,
  searchAssets,
  isHttpError,
  viewAsset,
} from '@immich/sdk'
import type { AssetItem, Asset, AlbumItem, Album } from './types'

const immichUrl = process.env.IMMICH_URL
const immichApiKey = process.env.IMMICH_API_KEY

if (!immichUrl) {
  throw new Error('Fill IMMICH_URL env var')
}
if (!immichApiKey) {
  throw new Error('Fill IMMICH_API_KEY env var')
}

init({
  baseUrl: `${immichUrl}/api`,
  apiKey: immichApiKey,
})

const assetTypeMap = Object.freeze({
  IMAGE: 'image',
  AUDIO: 'audio',
  VIDEO: 'video',
  OTHER: 'other',
})

const maxRetries = 8
const handleError = async <T>(fn: () => Promise<T>, retries = maxRetries): Promise<T | null> => {
  try {
    return await fn()
  } catch (ex) {
    if (isHttpError(ex) && ex.status === 404) {
      return null
    } else if (
      retries > 0 &&
      ex instanceof TypeError &&
      ex.cause instanceof AggregateError &&
      // oxlint-disable-next-line @typescript-eslint/no-unsafe-member-access
      ex.cause.errors[0]?.code === 'ETIMEDOUT'
    ) {
      await new Promise((resolve) => setTimeout(resolve, (maxRetries - retries) * 250))
      return await handleError(fn, retries - 1)
    }

    throw ex
  }
}

export const getAssetUrl = (assetId: string | null) => {
  if (!assetId) {
    return null
  }

  const url = new URL(`${immichUrl}/api/assets/${assetId}/original`)
  url.searchParams.set('apiKey', immichApiKey)
  return url
}

export const getAssetThumbnailUrl = (assetId: string | null) => {
  if (!assetId) {
    return null
  }

  const url = new URL(`${immichUrl}/api/assets/${assetId}/thumbnail`)
  url.searchParams.set('apiKey', immichApiKey)
  url.searchParams.set('size', 'thumbnail')
  return url
}

export const getAsset = async (assetId: string): Promise<Asset | null> => {
  const asset = await handleError(() => getAssetInfo({ id: assetId }))
  if (!asset) {
    return null
  }

  return {
    id: asset.id,
    title: asset.originalFileName,
    description: '',
    type: assetTypeMap[asset.type],
    thumbHash: asset.thumbhash,
    createdAt: new Date(asset.fileCreatedAt),
    exif: asset.exifInfo
      ? {
          cameraMaker: asset.exifInfo.make || null,
          cameraModel: asset.exifInfo.model || null,
          width: asset.exifInfo.exifImageWidth || null,
          height: asset.exifInfo.exifImageHeight || null,
          orientation: asset.exifInfo.orientation || null,
          lensModel: asset.exifInfo.lensModel || null,
          exposure: asset.exifInfo.exposureTime || null,
          aperture: asset.exifInfo.fNumber || null,
          focalLength: asset.exifInfo.focalLength || null,
          iso: asset.exifInfo.iso || null,
          exposureMode: null as string | null,
          flash: null as string | null,
          colorSpace: null as string | null,
        }
      : null,
    location:
      asset.exifInfo?.latitude && asset.exifInfo?.longitude
        ? {
            latitude: asset.exifInfo.latitude,
            longitude: asset.exifInfo.longitude,
            city: asset.exifInfo.city || null,
            state: asset.exifInfo.state || null,
            country: asset.exifInfo.country || null,
          }
        : null,
  }
}

export const getAlbumList = async (): Promise<AlbumItem[]> => {
  const albumList = (await handleError(() => getAllAlbums({ isShared: true }))) ?? []
  return albumList
    .map((album): AlbumItem => ({
      id: album.id,
      title: album.albumName,
      description: album.description,
      coverAssetId: album.albumThumbnailAssetId,
      createdAt: new Date(album.createdAt),
      updatedAt: new Date(album.updatedAt),
      lastPhotoTakenAt: album.endDate ? new Date(album.endDate) : null,
      count: album.assetCount,
    }))
    .toSorted((a, b) => +(b.lastPhotoTakenAt ?? b.updatedAt) - +(a.lastPhotoTakenAt ?? a.updatedAt))
}

export const getAlbum = async (albumId: string): Promise<Album | null> => {
  const album = await handleError(() => getAlbumInfo({ id: albumId }))
  if (!album) {
    return null
  }

  const { assets } = (await handleError(() =>
    searchAssets({
      metadataSearchDto: {
        albumIds: [albumId],
      },
    }),
  ))!
  return {
    id: album.id,
    title: album.albumName,
    description: album.description,
    coverAssetId: album.albumThumbnailAssetId,
    createdAt: new Date(album.createdAt),
    updatedAt: new Date(album.updatedAt),
    lastPhotoTakenAt: album.endDate ? new Date(album.endDate) : null,
    count: album.assetCount,
    assets: assets.items
      .map((asset): AssetItem => ({
        id: asset.id,
        type: assetTypeMap[asset.type],
        title: asset.originalFileName,
        description: '',
        thumbHash: asset.thumbhash,
        createdAt: new Date(asset.fileCreatedAt),
      }))
      .toSorted((a, b) => +b.createdAt - +a.createdAt),
  }
}

export const fetchAsset = async (assetId: string): Promise<Blob | null> => {
  const content = await handleError(() => downloadAsset({ id: assetId }))
  return content
}

export const fetchAssetThumbnail = async (assetId: string): Promise<Blob | null> => {
  const content = await handleError(() =>
    viewAsset({
      id: assetId,
      size: AssetMediaSize.Thumbnail,
    }),
  )
  return content
}
