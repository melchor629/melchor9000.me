import { DateTime } from 'luxon'

export type Validator = (value: string) => boolean

export const isValid = (value: string, validators: Validator[]) => validators.reduce((a, val) => val(value) && a, true)

export const valueValidator = (value: boolean) => () => value

export const orValidator = (...vals: Validator[]) => (value: string) => vals.reduce((a, val) => val(value) || a, false)

export const regexValidator = (regex: RegExp) => (value: string) => !!regex.exec(value)

export const emailValidator = regexValidator(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)

//https://stackoverflow.com/questions/3809401/what-is-a-good-regular-expression-to-match-a-url
export const urlValidator = regexValidator(/[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/)

export const urlOrLocalValidator = orValidator(
    regexValidator(/\/([-a-zA-Z0-9@:%_+.~#?&//=]*)/),
    urlValidator,
)

export const dateValidator = (format?: string) =>
    typeof format === 'string' ?
        ((value: string) => DateTime.fromFormat(value, format).isValid) :
        ((value: string) => DateTime.fromISO(value).isValid)
