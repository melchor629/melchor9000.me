import { DateTime } from 'luxon'

export type Validator = (value: string) => boolean

export const isValid = (value: string, validators: Validator[]) => (
  validators.reduce((a, val) => val(value) && a, true)
)

export const valueValidator = (value: boolean) => () => value

export const orValidator = (...vals: Validator[]) => (
  (value: string) => vals.reduce((a, val) => val(value) || a, false)
)

export const regexValidator = (regex: RegExp) => (value: string) => !!regex.exec(value)

export const emailValidator = regexValidator(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)

// https://stackoverflow.com/questions/3809401/what-is-a-good-regular-expression-to-match-a-url
export const urlRegex = /[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/
export const urlValidator = regexValidator(/[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/)

export const urlOrLocalRegex = new RegExp(`(?:${urlRegex.source})|(?:\\/([-a-zA-Z0-9@:%_+.~#?&//=]*))`)
export const urlOrLocalValidator = orValidator(
  regexValidator(/\/([-a-zA-Z0-9@:%_+.~#?&//=]*)/),
  urlValidator,
)

export const dateValidator = (format?: string) => (typeof format === 'string'
  ? ((value: string) => DateTime.fromFormat(value, format).isValid)
  : ((value: string) => DateTime.fromISO(value).isValid))

export const validateUrlByFetching = (expectedContentType?: string) => async (v: string) => {
  if (!v) {
    return true
  }

  const url = new URL(v, window.location.origin)
  if (url.origin !== window.location.origin) {
    // we cannot check URLs outside our domain
    return true
  }

  const res = await fetch(v, { method: 'HEAD' })
  const contentType = res.headers.get('Content-Type')

  if (!res.ok) {
    return `Status Code is not ok: ${res.status} [${res.statusText}]`
  }

  if (expectedContentType && (!contentType || !contentType.startsWith(expectedContentType))) {
    return `Content Type is invalid: expected to start with '${expectedContentType}' but got '${contentType}'`
  }

  return true
}
