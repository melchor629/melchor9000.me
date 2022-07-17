/* eslint-disable no-underscore-dangle */
import { RequestHandler } from 'express'
import * as functions from 'firebase-functions'
import BadRequest from '../../utils/errors/bad-request.js'
import { people } from '../../utils/logic/flickr.js'
import { toNumber, toNumberFromQuery } from '../../utils/helpers.js'

const photosGetController: RequestHandler = async (req, res) => {
  const perPage = toNumberFromQuery(req.query, 'perPage') ?? 500
  const page = toNumberFromQuery(req.query, 'page') ?? 1

  if (perPage < 1 || perPage > 500 || page < 1) {
    throw new BadRequest()
  }

  const { photos } = await people.getPublicPhotos({
    user_id: functions.config().flickr.user_id,
    page,
    per_page: perPage,
  })

  res.set('Cache-Control', 'public, max-age=3600').json({
    page: toNumber(photos.page),
    pages: toNumber(photos.pages),
    total: toNumber(photos.total),
    photos: photos.photo.map((p) => ({
      id: p.id,
      secret: p.secret,
      server: p.server,
      farm: p.farm,
      title: typeof p.title === 'string' ? p.title : p.title?._content,
    })),
  })
}

export default photosGetController
