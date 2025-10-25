import { Box } from '@mui/material'
import type { Metadata } from 'next'
import { getAlbumList } from '@/clients/gallery'
import Container from '@/components/container'
import PageHeader from '@/components/page-header'
import AlbumCard from './album-card'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Gallery',
  description: 'The photo gallery of melchor629',
  keywords: ['photo', 'gallery', 'pictures'],
  openGraph: {
    type: 'website',
    title: 'Gallery',
    description: 'The photo gallery of melchor629',
  },
}

export default async function Gallery() {
  const albums = await getAlbumList().catch(() => [])

  return (
    <Container>
      <PageHeader
        title="Photo gallery"
        subtitle="A selection of photos to be enjoyed, grouped in albums…"
      />

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(315px, 1fr))',
          columnGap: 2,
          rowGap: 2,
          mb: 4,
        }}
      >
        {albums.map((album) => (
          <AlbumCard key={album.id} album={album} />
        ))}
      </Box>
    </Container>
  )
}
