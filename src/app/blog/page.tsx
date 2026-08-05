"use cache"

import Grid from '@mui/material/Grid'
import type { Metadata } from 'next'
import Container from '@/components/container'
import PageHeader from '@/components/page-header'
import { getBlogPosts } from '@/content/blog'
import PostCard from './post-card'
import { cacheLife } from 'next/cache'

export const metadata: Metadata = {
  title: 'Blog',
  keywords: ['blog'],
}

export default async function Blog() {
  cacheLife('days')
  const blogPosts = await getBlogPosts()
  return (
    <Container>
      <PageHeader
        title="Blog"
        subtitle="Posts about programming and related stuff"
      />
      <Grid container rowSpacing={2} columnSpacing={1}>
        {blogPosts.map((post) => (
          <Grid key={post.slug} size={{ xs: 12, md: 6, lg: 4 }}>
            <PostCard key={post.slug} post={post} />
          </Grid>
        ))}
      </Grid>
    </Container>
  )
}
