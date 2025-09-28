import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Container from '@/components/container'
import { getBlogPost, getBlogPosts } from '@/content/blog'
import PostContent from './post-content'
import PostHeader from './post-header'

type Params = {
  readonly params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const blogPost = await getBlogPost(slug)
  if (!blogPost) {
    notFound()
  }

  return {
    title: `${blogPost.title} - Blog`,
    keywords: ['blog', 'post', ...blogPost.categories],
    openGraph: {
      type: 'article',
      title: `${blogPost.title} - Blog`,
      images: blogPost.cover.src,
      url: `/blog/${slug}`,
    },
  }
}

export async function generateStaticParams(): Promise<PromiseResolvedType<Params['params']>[]> {
  const posts = await getBlogPosts()
  return posts.map((post) => ({ slug: post.slug }))
}

export default async function BlogPage({ params }: Params) {
  const { slug } = await params
  const blogPost = await getBlogPost(slug)
  if (!blogPost) {
    notFound()
  }

  return (
    <Container component="article">
      <PostHeader blogPost={blogPost} />
      <PostContent content={blogPost.content} />
    </Container>
  )
}
