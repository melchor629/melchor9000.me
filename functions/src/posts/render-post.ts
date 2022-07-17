import { RequestHandler } from 'express'
import fs from 'fs/promises'
import * as firebase from 'firebase-admin'
import { promisify } from 'util'
import { handlerCatch } from '../utils/decorators/index.js'
import renderPost from '../utils/logic/render-post.js'

const { version } = JSON.parse(await fs.readFile('./package.json', 'utf-8'))

const renderPostController: RequestHandler = handlerCatch(async (req, res) => {
  const { postId } = req.params

  const postsCollection = firebase.firestore().collection('posts')
  const postDocument = await postsCollection.doc(postId).get()
  if (!postDocument.exists) {
    return res.status(404).json({
      error: 404,
      message: `Could not find post with ID ${postId}`,
    })
  }

  const post = postDocument.data()!
  const file = firebase.storage().bucket().file(post.file.substr(1))
  const cachedFile = firebase.storage().bucket().file(`.cached${post.file}`)
  const [[fileExists], [cachedFileExists]] = await res.measure(
    Promise.all([file.exists(), cachedFile.exists()]),
    'storage.exists',
  )
  if (!fileExists) {
    return res.status(400).json({
      error: 400,
      message: `Post ${postId} has no file linked`,
    })
  }

  let [{ etag, timeCreated, updated }] = await res.measure(file.getMetadata(), 'storage.metadata.file')
  let cachedFileContents: { version: string, etag: string, lastModified: string, content: string }
  if (!cachedFileExists) {
    cachedFileContents = {
      version,
      etag,
      lastModified: new Date(0).toISOString(),
      content: '',
    }
  } else {
    try {
      const [contents] = await res.measure(
        cachedFile.download({ validation: false }),
        'storage.download.cached',
      )
      cachedFileContents = JSON.parse(contents.toString('utf8'))
    } catch {
      cachedFileContents = {
        version,
        etag,
        lastModified: new Date(0).toISOString(),
        content: '',
      }
    }
  }

  if (
    cachedFileContents.version !== version
      || cachedFileContents.etag !== etag
      || new Date(cachedFileContents.lastModified) < new Date(updated || timeCreated)
  ) {
    const [contents] = await res.measure(file.download({ validation: false }), 'storage.download.file')
    const fileContents = contents.toString('utf8')
    const html = await res.measure(
      renderPost(fileContents, file.name.endsWith('.md') ? 'md' : 'html'),
      'render',
    )
    cachedFileContents.content = html
    cachedFileContents.lastModified = new Date().toISOString()
    cachedFileContents.version = version
    cachedFileContents.etag = etag

    const stream = cachedFile.createWriteStream({ resumable: false, private: true, contentType: 'application/json' })
    await res.measure(async () => {
      await promisify<string, 'utf8'>(stream.write.bind(stream))(JSON.stringify(cachedFileContents), 'utf8')
      await promisify(stream.end.bind(stream))()
    }, 'storage.upload.cached')
  }

  [{ etag, timeCreated, updated }] = await res.measure(cachedFile.getMetadata(), 'storage.metadata.cached')
  res.setHeader('Cache-Control', 'max-age=86400, stale-while-revalidate=86400')
  res.setHeader('ETAG', etag)
  res.setHeader('Last-Modified', updated || timeCreated)
  if (req.fresh) {
    return res.status(304).end()
  }

  return res.json({
    renderedHtml: cachedFileContents.content,
    postId,
  })
})

export default renderPostController
