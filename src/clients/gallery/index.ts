import * as flickr from './flickr'
import * as immich from './immich'

export type * from './types'

const implType = 'immich' as 'flickr' | 'immich'

function getImpl() {
  if (implType === 'flickr') {
    return flickr
  }
  if (implType === 'immich') {
    return immich
  }

  throw new Error(`Invalid gallery implementation type: ${implType as string}`)
}

const impl = getImpl()

export const {
  fetchAsset,
  fetchAssetThumbnail,
  getAlbum,
  getAlbumList,
  getAsset,
} = impl
