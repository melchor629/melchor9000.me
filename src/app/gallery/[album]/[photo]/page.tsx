import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getAsset, getAlbum } from '@/clients/gallery'
import PhotoCanvas from './photo-canvas'
import PhotoInfo from './photo-info'
import { cacheLife } from 'next/cache'

type Params = PageProps<'/gallery/[album]/[photo]'>

export const instant = false

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { album, photo: photoId } = await params
  const photo = await getAsset(photoId)
  if (!photo) {
    notFound()
  }

  return {
    title: `${photo.title} - Gallery`,
    description: photo.description,
    keywords: ['photo', 'gallery', 'pictures'],
    openGraph: {
      type: 'website',
      title: `${photo.title} - Gallery`,
      description: photo.description,
      images: `/gallery/${album}/${photoId}/thumbnail`,
      url: `/gallery/${album}/${photoId}`,
    },
  }
}

/* export async function generateStaticParams(): Promise<PromiseResolvedType<Params['params']>[]> {
  const albums = await getAlbumList()
  return Promise.all(
    albums.map(async ({ id: albumId }) => {
      const album = await getAlbum(albumId)
      if (album) {
        return album.assets.map((a) => ({ album: album.id, photo: a.id }))
      }
      return []
    }),
  ).then((r) => r.flat())
} */

export default async function GalleryPhotoAlbum({ params }: Params) {
  'use cache'

  cacheLife('days')
  const { album: albumId, photo: photoId } = await params
  const [photo, album] = await Promise.all([getAsset(photoId), getAlbum(albumId)])

  if (photo == null || album == null) {
    notFound()
  }

  const assets = album.assets.filter((asset) => asset.type === 'image')
  const photoPosition = assets.findIndex((a) => a.id === photoId)
  if (photoPosition === -1) {
    notFound()
  }

  const nextPhotoId: string | undefined = assets[photoPosition + 1]?.id
  const prevPhotoId: string | undefined = assets[photoPosition - 1]?.id
  return (
    <>
      <PhotoCanvas
        album={album}
        nextPhotoId={nextPhotoId}
        photo={photo}
        prevPhotoId={prevPhotoId}
      />
      <PhotoInfo photo={photo} />
    </>
  )
}
