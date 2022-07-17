import { RequestHandler } from 'express'
import * as functions from 'firebase-functions'
import BadRequest from '../../utils/errors/bad-request.js'
import { photosets } from '../../utils/logic/flickr.js'
import { toNumber, toNumberFromQuery } from '../../utils/helpers.js'

const photosetsGetListController: RequestHandler = async (req, res) => {
  const perPage = toNumberFromQuery(req.query, 'perPage') ?? 500
  const page = toNumberFromQuery(req.query, 'page') ?? 1

  if (perPage < 1 || perPage > 500 || page < 1) {
    throw new BadRequest()
  }

  const { photosets: result } = await photosets.getList({
    user_id: functions.config().flickr.user_id,
    page,
    per_page: perPage,
  })

  const mappedPhotosets = result.photoset.map((p) => ({
    id: p.id,
    owner: p.owner,
    username: p.username,
    primary: p.primary,
    secret: p.secret,
    server: p.server,
    farm: p.farm,
    counts: {
      views: toNumber(p.count_views),
      comments: toNumber(p.count_comments),
      photos: toNumber(p.count_photos),
      videos: toNumber(p.count_videos),
    },
    // eslint-disable-next-line no-underscore-dangle
    title: p.title?._content,
    // eslint-disable-next-line no-underscore-dangle
    description: p.description?._content,
    dateCreated: new Date(toNumber(p.date_create) * 1000),
    dateUpdated: new Date(toNumber(p.date_update) * 1000),
  }))

  res.set('Cache-Control', 'public, max-age=3600').json({
    page: toNumber(result.page),
    pages: toNumber(result.pages),
    total: toNumber(result.total),
    photosets: mappedPhotosets,
  })
}

export default photosetsGetListController
