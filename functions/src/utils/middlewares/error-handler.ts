import { Request, Response } from 'express'

function errorHandler(err: any, _: Request, res: Response) {
  if (err.status && typeof err.status === 'number') {
    res.status(err.status)
  } else {
    res.status(500)
  }

  res.json({
    error: err.status || 500,
    message: err.message,
    type: err.constructor?.name,
  })
}

export default errorHandler
