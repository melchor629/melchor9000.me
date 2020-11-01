export default class BadRequest extends Error {
  readonly status = 403

  constructor(message?: string) {
    super(message)
  }
}
