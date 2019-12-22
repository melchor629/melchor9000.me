import { RequestHandler } from 'express'
import * as firebase from 'firebase-admin'
import { handlerCatch } from '../utils/decorators'
import renderPost from '../utils/logic/render-post'

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
  if (!file.exists()) {
    return res.status(400).json({
      error: 400,
      message: `Post ${postId} has no file linked`,
    })
  }

  const { etag, timeCreated, updated } = (await file.getMetadata())[0]
  res.setHeader('Cache-Control', 'max-age=86400, stale-while-revalidate=86400')
  res.setHeader('ETAG', etag)
  res.setHeader('Last-Modified', updated || timeCreated)
  if (req.fresh) {
    return res.status(304).end()
  }

  const fileContents = (await file.download())[0].toString('utf8')
  const html = renderPost(fileContents, file.name.endsWith('.md') ? 'md' : 'html')

  return res.json({
    renderedHtml: html,
    postId,
  })
})

export default renderPostController
