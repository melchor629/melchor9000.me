import { RequestHandler } from 'express'
import { config } from 'firebase-functions'
import serverTiming from 'server-timing'

declare global {
  namespace Express {
    interface Response {
      measure<T>(promise: Promise<T>, name: string, description?: string): Promise<T>
      measure<T>(fn: () => Promise<T>, name: string, description?: string): Promise<T>
    }
  }
}

const serverTimingMiddleware = (): RequestHandler => {
  const middleware = serverTiming({
    enabled: (req) => {
      const { dev } = config()
      return process.env.NODE_ENV !== 'production' || dev || !!req.query.serverTiming
    },
  })

  return (req, res, next) => {
    res.measure = async <T>(
      fnOrPromise: (() => Promise<T>) | Promise<T>,
      name: string,
      description?: string,
    ): Promise<T> => {
      res.startTime(name, description || name)
      try {
        return await (typeof fnOrPromise === 'function' ? fnOrPromise() : fnOrPromise)
      } finally {
        res.endTime(name)
      }
    }

    middleware(req, res, next)
  }
}

export default serverTimingMiddleware
