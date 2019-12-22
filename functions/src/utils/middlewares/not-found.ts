import { RequestHandler } from 'express'

const notFoundMiddleware: RequestHandler = (req, res) => res.json({
  error: 404,
  message: `Cannot ${req.method} ${req.path}`,
})

export default notFoundMiddleware
