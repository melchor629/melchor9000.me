import { Box, Typography } from '@mui/material'
import type { Album } from '@/clients/gallery'
import StyledImage from '@/components/styled-image'

const GalleryAlbumHeader = ({ album }: { readonly album: Album }) => (
  <Box sx={{ position: 'relative', top: -48, minHeight: '33vh', maxHeight: 600 }}>
    {album.coverAssetId && (
      <StyledImage
        alt="Album primary photo"
        src={`/gallery/${album.id}/${album.coverAssetId}/original`}
        priority
        fill
        fit="cover"
      />
    )}
    <Box
      sx={{
        position: 'relative',
        textAlign: 'center',
        top: 0,
        left: 0,
        width: '100%',
        minHeight: '33vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        px: 2,
        pt: 7,
        pb: 2,
        backdropFilter: 'blur(3px) brightness(80%)',
        textShadow: '0 0 6px black',
      }}
    >
      <Typography
        variant="h2"
        gutterBottom
      >
        {album.title}
      </Typography>
      <Typography variant="subtitle1">{album.description}</Typography>
    </Box>
  </Box>
)

export default GalleryAlbumHeader
