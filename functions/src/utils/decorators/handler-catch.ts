import { RequestHandler } from 'express'

const handlerCatch = (func: RequestHandler): RequestHandler => (req, res, next) => {
  const returnValue = func(req, res, next)
  if (returnValue instanceof Promise) {
    returnValue.catch((e) => next(e))
  }
}

export default handlerCatch
