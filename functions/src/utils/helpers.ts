import { Request } from 'express'
import BadRequest from './errors/bad-request'

export const toNumber = (input: string | number, radix: number = 10) => {
  if (typeof input === 'string') {
    return parseInt(input.replace(',', '.'), radix)
  }

  return input
}

export const toNumberFromQuery = (query: Request['query'], key: string, required?: boolean): number | undefined => {
  const value = query[key]
  if (typeof value === 'string') {
    const number = parseInt(value, 10)
    if (Number.isNaN(number)) {
      throw new BadRequest()
    }

    return number
  }

  if (required || value) {
    throw new BadRequest()
  }

  return undefined
}
