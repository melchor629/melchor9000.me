import { Request, Response } from 'express'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function errorHandler(err: any, req: Request, res: Response, next: any) {
  if (err.status && typeof err.status === 'number') {
    res.status(err.status)
  } else {
    res.status(500)
  }

  // eslint-disable-next-line no-console
  console.error(err)
  res.json({
    error: err.status || 500,
    message: err.message,
    type: err.constructor?.name,
  })
}

export default errorHandler
