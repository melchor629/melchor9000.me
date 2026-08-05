import { ArrowBack } from '@mui/icons-material'
import {
  Box,
  Container, Tooltip, Typography,
} from '@mui/material'
import type { Metadata } from 'next'
import { cacheLife } from 'next/cache'
import { notFound } from 'next/navigation'
import { getAlbum } from '@/clients/gallery'
import IconButtonLink from '@/components/icon-button-link'
import GalleryAlbumHeader from './gallery-album-header'
import GalleryPhoto from './gallery-photo'

type Params = PageProps<'/gallery/[album]'>

export const instant = false

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { album: albumId } = await params
  const album = await getAlbum(albumId)
  if (!album) {
    notFound()
  }

  return {
    title: `${album.title} - Gallery`,
    description: album.description,
    keywords: ['photo', 'gallery', 'pictures'],
    openGraph: {
      type: 'website',
      title: `${album.title} - Gallery`,
      description: album.description,
      images: album.coverAssetId ? `/gallery/${albumId}/${album.coverAssetId}/thumbnail` : undefined,
      url: `/gallery/${albumId}`,
    },
  }
}

/* export async function generateStaticParams(): Promise<PromiseResolvedType<Params['params']>[]> {
  const albums = await getAlbumList()
  return albums.map((album) => ({ album: album.id }))
} */

export default async function GalleryAlbum({ params }: Params) {
  'use cache'

  cacheLife('hours')
  const { album: albumId } = await params
  const album = await getAlbum(albumId)
  if (!album) {
    notFound()
  }

  return (
    <>
      <GalleryAlbumHeader album={album} />
      <Container sx={{ mt: -4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Tooltip title="Go to gallery" disableInteractive placement="right">
            <IconButtonLink size="small" href="/gallery">
              <ArrowBack fontSize="inherit" />
            </IconButtonLink>
          </Tooltip>
          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
            }}
          >
            {album.lastPhotoTakenAt
              ? `Last photo taken ${album.lastPhotoTakenAt.toLocaleDateString('en', { dateStyle: 'short' })}`
              : `Last update ${album.updatedAt.toLocaleString('en', { dateStyle: 'short' })}`}
            {' - '}
            {`${album.count} photos`}
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            columnGap: 2,
            rowGap: 2,
          }}
        >
          {album.assets.filter((asset) => asset.type === 'image').map((asset) => (
            <GalleryPhoto
              key={asset.id}
              albumId={albumId}
              id={asset.id}
              title={asset.title}
              thumbHash={asset.thumbHash}
              thumbUrl={`/gallery/${album.id}/${asset.id}/thumbnail`}
            />
          ))}
        </Box>
      </Container>
    </>
  )
}
