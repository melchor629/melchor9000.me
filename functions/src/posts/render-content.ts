import { RequestHandler } from 'express'
import etag from 'etag'
import renderPost from '../utils/logic/render-post'
import { handlerCatch } from '../utils/decorators'

const renderContentController: RequestHandler = handlerCatch(async (req, res) => {
  const { content, format } = req.body

  if (!content || !format) {
    return res.status(400).json({
      error: 400,
      message: 'Invalid body',
    })
  }

  res.setHeader('Cache-Control', 'max-age=3600')
  res.setHeader('ETAG', etag(content))
  if (req.fresh) {
    return res.status(304).end()
  }

  const html = await renderPost(content, format)

  return res.json({
    renderedHtml: html,
  })
})

export default renderContentController
