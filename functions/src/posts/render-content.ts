import { RequestHandler } from 'express'
import * as etag from 'etag'
import renderPost from '../utils/logic/render-post'

const renderContentController: RequestHandler = (req, res) => {
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

  const html = renderPost(content, format)

  return res.json({
    renderedHtml: html,
  })
}

export default renderContentController
