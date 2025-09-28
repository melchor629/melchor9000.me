import {
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  CardMedia,
  Chip,
  Stack,
} from '@mui/material'
import Link from 'next/link'
import StyledImage from '@/components/styled-image'
import type { BlogEntry } from '@/content/blog'

export default function PostCard({ post }: { readonly post: BlogEntry }) {
  return (
    <Card>
      <CardActionArea component={Link} href={`/blog/${post.slug}`}>
        <CardHeader
          title={post.title}
          subheader={`Published at ${post.date.toLocaleString(['en-GB'], { dateStyle: 'full' })}`}
          slotProps={{
            title: { noWrap: true },
            content: { sx: { width: '100%' } },
          }}
        />
        <CardMedia component="div" sx={{ position: 'relative', pb: '50%' }}>
          <StyledImage
            src={post.cover}
            alt={`Cover image for blog post titled ${post.title}`}
            fill
            sizes="(max-width: 900px) 100vw, (max-width: 1200px) 50vw, 33vw"
            fit="cover"
          />
        </CardMedia>
        <CardContent>
          <Stack direction="row" gap={1}>
            {post.categories.map((c) => <Chip key={c} label={c} variant="outlined" />)}
            {post.categories.length === 0 && <Chip label="no categories" variant="outlined" />}
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}
