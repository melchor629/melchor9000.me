'use client'

import { styled } from '@mui/material/styles'

const PostCoverFigure = styled('figure', { name: 'PostCoverFigure' })(({ theme }) => ({
  position: 'relative',
  width: '100%',
  margin: 0,
  paddingBottom: '55%',
  marginBottom: theme.spacing(2),
  background: theme.vars.overlays[1],
  boxShadow: theme.vars.shadows[5],

  '&, & > img': {
    borderRadius: theme.vars.shape.borderRadius,
  },
}))

export default PostCoverFigure
