'use client'

import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import {
  FaGithub,
  FaInstagram,
  FaLastfm,
  FaLinkedin,
  FaReddit,
  FaSpotify,
  FaTwitter,
} from '@/components/fa-icons'
import HelloPhoto from './hello-photo'
import { Skeleton } from '@mui/material'

const HelloContainer = styled(Box, { name: 'Hello' })(({ theme }) => ({
  minHeight: 'calc(100lvh - 48px)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
  flexGrow: 1,
  userSelect: 'none',
  paddingBlock: theme.spacing(2),
}))

const SocialsLinkContainer = styled(Box, { name: 'Hello', slot: 'socials' })(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(0.5),
  marginTop: theme.spacing(1),
}))

export default function Hello({ random }: { readonly random?: number }) {
  return (
    <HelloContainer>
      <Typography variant="h3">
        melchor9000
      </Typography>
      <Typography
        variant="h4"
        sx={{
          color: 'text.secondary',
        }}
      >
        Melchor Garau Madrigal
      </Typography>
      {random && <HelloPhoto random={random} />}
      {!random && <Skeleton sx={{ width: 256, height: 256 }} variant="circular" />}
      <SocialsLinkContainer>
        <IconButton component="a" href="https://github.com/melchor629" target="_blank" rel="noreferrer">
          <FaGithub />
        </IconButton>
        <IconButton component="a" href="https://twitter.com/melchor629" target="_blank" rel="noreferrer">
          <FaTwitter />
        </IconButton>
        <IconButton component="a" href="https://www.reddit.com/user/melchor9000/" target="_blank" rel="noreferrer">
          <FaReddit />
        </IconButton>
        <IconButton component="a" href="https://www.instagram.com/melchor9000/" target="_blank" rel="noreferrer">
          <FaInstagram />
        </IconButton>
        <IconButton component="a" href="https://open.spotify.com/user/melchor629" target="_blank" rel="noreferrer">
          <FaSpotify />
        </IconButton>
        <IconButton component="a" href="https://www.last.fm/user/melchor629" target="_blank" rel="noreferrer">
          <FaLastfm />
        </IconButton>
        <IconButton component="a" href="https://www.linkedin.com/in/melchor9000/" target="_blank" rel="noreferrer">
          <FaLinkedin />
        </IconButton>
      </SocialsLinkContainer>
    </HelloContainer>
  )
}
