import { Box, Chip, Stack, Typography } from '@mui/material'
import StyledImage from '@/components/styled-image'
import type { BlogEntry } from '@/content/blog'
import PostCoverFigure from './post-cover-figure'
import ShareLinks from './share-links'

export default function PostHeader({ blogPost }: { readonly blogPost: BlogEntry }) {
  return (
    <Box component="header" sx={{ textAlign: 'center', mb: { xs: 4, md: 6 } }}>
      <Typography variant="h2" gutterBottom>{blogPost.title}</Typography>
      <Stack
        direction="row"
        sx={{
          gap: 1,
          justifyContent: 'center',
          mb: 2,
        }}
      >
        {blogPost.categories.map((c) => <Chip key={c} label={c} size="small" variant="outlined" />)}
      </Stack>
      <PostCoverFigure>
        <StyledImage
          src={blogPost.cover}
          alt="Blog post cover"
          fill
          fit="cover"
          priority
        />
      </PostCoverFigure>
      <Box
        component="section"
        sx={{
          mt: 4,
        }}
      >
        <Typography variant="subtitle1" gutterBottom>
          <span>Created at&nbsp;</span>
          <time dateTime={blogPost.date.toISOString().split('T')[0]}>
            {blogPost.date.toLocaleString(['en-GB'], { dateStyle: 'full' })}
          </time>
        </Typography>
      </Box>
      <ShareLinks title={blogPost.title} />
    </Box>
  )
}
