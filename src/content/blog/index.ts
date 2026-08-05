import fs from 'node:fs/promises'
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import type { StaticImageData } from 'next/image'
import { cache, type FC } from 'react'

export type BlogEntry = Readonly<{
  title: string
  date: Date
  cover: StaticImageData
  categories: string[]
  slug: string
  content: FC<object>
}>

const parseBlogPost = (slug: string, contents: Record<string, unknown>): BlogEntry => {
  if (typeof contents.title !== 'string') {
    throw new Error("Blog post must export const title = '...'")
  }
  if (typeof contents.date !== 'string') {
    throw new Error("Blog post must export const date = 'YYYY-MM-ddTHH:mm:ssZ'")
  }
  if (contents.cover && typeof contents.cover !== 'object') {
    throw new Error("Blog post must export { default as cover } from './cover.png'")
  }
  if (contents.categories && !Array.isArray(contents.categories)) {
    throw new Error('Blog post must export const categories = [...]')
  }
  return Object.freeze({
    title: contents.title,
    date: new Date(contents.date),
    cover: contents.cover as StaticImageData,
    categories: (contents.categories as string[]) ?? [],
    slug,
    content: contents.default as FC<object>,
  })
}

const blogDirPath = dirname(fileURLToPath(import.meta.url))

export const getBlogPost = cache(async (slug: string): Promise<BlogEntry | null> => {
  try {
    const contents = (await import(`@/content/blog/${slug}/post.mdx`)) as Record<string, unknown>
    return parseBlogPost(slug, contents)
  } catch (e) {
    if (e && typeof e === 'object' && 'code' in e && e.code === 'MODULE_NOT_FOUND') {
      return null
    }
    throw e
  }
})

export const getBlogPosts = cache(async (): Promise<BlogEntry[]> => {
  const files = await fs.readdir(blogDirPath, {
    encoding: 'utf-8',
    recursive: true,
    withFileTypes: true,
  })
  const mdxFiles = files.filter((file) => file.isDirectory()).map((file) => file.name)
  const posts = await Promise.all(mdxFiles.map(async (mdxFile) => (await getBlogPost(mdxFile))!))
  return posts.toSorted((a, b) => +b.date - +a.date)
})
