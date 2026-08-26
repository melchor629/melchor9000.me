import { MusicNote, Speaker } from '@mui/icons-material'
import { Box, Card, CardMedia, Tooltip, Typography } from '@mui/material'
import { type RecentTrackItem } from '@/clients/lastfm'

export default function TrackCard({ track }: { readonly track: RecentTrackItem }) {
  return (
    <Card key={track.nowPlaying ? 'np' : +track.scrobbledAt!}>
      <Box sx={{ display: 'flex', gap: 0.5 }}>
        <CardMedia
          component="img"
          image={track.albumArtImages.at(-1)?.url || ''}
          alt={track.album ? `Album cover for ${track.album}` : 'Album cover for the song'}
          sx={{
            '--size': {
              xs: '100px',
              md: '128px',
              lg: '256px',
            },
            height: 'var(--size)',
            width: 'var(--size)',
          }}
        />
        <Box sx={{ position: 'relative', px: 2, py: 1, width: '100%' }}>
          <Typography variant="h5">{track.title}</Typography>
          <Typography
            variant="subtitle1"
            sx={{
              color: 'text.secondary',
            }}
          >
            {track.artist}
          </Typography>
          <Typography
            variant="subtitle2"
            sx={{
              color: 'text.secondary',
            }}
          >
            {track.album}
          </Typography>

          <Box sx={{ position: 'absolute', top: 0, right: 0, mt: 1, mr: 1 }}>
            {track.nowPlaying && (
              <Tooltip
                title="Now playing"
                disableInteractive
              >
                <Speaker />
              </Tooltip>
            )}
            {track.scrobbledAt != null && (
              <Tooltip title={`Scrobbled at ${track.scrobbledAt.toLocaleString()}`}>
                <MusicNote
                  color="inherit"
                  sx={{ color: 'text.secondary' }}
                />
              </Tooltip>
            )}
          </Box>
        </Box>
      </Box>
    </Card>
  )
}
