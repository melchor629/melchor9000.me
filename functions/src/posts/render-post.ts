import { RequestHandler } from 'express'
import * as firebase from 'firebase-admin'
import { promisify } from 'util'
import { handlerCatch } from '../utils/decorators'
import renderPost from '../utils/logic/render-post'

const { version } = require('../../package.json')

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
  const [[fileExists], [cachedFileExists]] = await Promise.all([file.exists(), cachedFile.exists()])
  if (!fileExists) {
    return res.status(400).json({
      error: 400,
      message: `Post ${postId} has no file linked`,
    })
  }

  let [{ etag, timeCreated, updated }] = await file.getMetadata()
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
      cachedFileContents = JSON.parse((await cachedFile.download())[0].toString('utf8'))
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
    const fileContents = (await file.download())[0].toString('utf8')
    const html = renderPost(fileContents, file.name.endsWith('.md') ? 'md' : 'html')
    cachedFileContents.content = html

    const stream = cachedFile.createWriteStream({ resumable: false, private: true, contentType: 'application/json' })
    await promisify<string, 'utf8'>(stream.write.bind(stream))(JSON.stringify(cachedFileContents), 'utf8')
    await promisify(stream.end.bind(stream))()
  }

  [{ etag, timeCreated, updated }] = await cachedFile.getMetadata()
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
