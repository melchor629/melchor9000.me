import { RequestHandler } from 'express'
import * as functions from 'firebase-functions'
import BadRequest from '../../utils/errors/bad-request'
import { photosets } from '../../utils/logic/flickr'
import { toNumber, toNumberFromQuery } from '../../utils/helpers'

const photosetsGetPhotosController: RequestHandler = async (req, res) => {
  const { photosetId } = req.params
  const perPage = toNumberFromQuery(req.query, 'perPage') ?? 500
  const page = toNumberFromQuery(req.query, 'page') ?? 1

  if (perPage < 1 || perPage > 500 || page < 1) {
    throw new BadRequest()
  }

  const { photoset: result } = await photosets.getPhotos({
    user_id: functions.config().flickr.user_id,
    photoset_id: photosetId,
    page,
    per_page: perPage,
  })

  if (!result) {
    res.status(404).end()
    return
  }

  const mappedPhotos = result.photo.map((p) => ({
    id: p.id,
    secret: p.secret,
    server: p.server,
    farm: p.farm,
    // eslint-disable-next-line no-underscore-dangle
    title: typeof p.title === 'string' ? p.title : p.title?._content,
  }))

  res.set('Cache-Control', 'public, max-age=3600').json({
    page: toNumber(result.page),
    pages: toNumber(result.pages),
    total: toNumber(result.total),
    id: result.id,
    primary: result.primary,
    owner: result.owner,
    photos: mappedPhotos,
  })
}

export default photosetsGetPhotosController
