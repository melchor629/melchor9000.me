import { Photo } from '@mui/icons-material'
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Typography,
} from '@mui/material'
import Link from 'next/link'
import { getAsset, type AlbumItem } from '@/clients/gallery'
import AlbumCardPhoto from './album-card-photo'

export default async function AlbumCard({ album }: { readonly album: AlbumItem }) {
  const photo = album.coverAssetId ? await getAsset(album.coverAssetId) : null
  return (
    <Card>
      <CardActionArea LinkComponent={Link} href={`/gallery/${album.id}`} sx={{ height: '100%' }}>
        {photo && (
          <AlbumCardPhoto
            assetId={album.coverAssetId}
            thumbHash={photo.thumbHash}
            thumbUrl={`/gallery/${album.id}/${photo.id}/thumbnail`}
          />
        )}
        <CardContent>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: 1,
            }}
          >
            <Typography gutterBottom variant="h6" component="div">
              {album.title}
            </Typography>
            <Chip
              variant="outlined"
              size="small"
              icon={<Photo />}
              label={album.count}
            />
          </Box>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {album.description}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}
