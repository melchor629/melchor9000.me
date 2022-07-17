import { RequestHandler } from 'express'
import * as functions from 'firebase-functions'
import { photosets } from '../../utils/logic/flickr.js'
import { toNumber } from '../../utils/helpers.js'

const photosetsGetInfoController: RequestHandler = async (req, res) => {
  const { photosetId } = req.params

  const { photoset } = await photosets.getInfo({
    user_id: functions.config().flickr.user_id,
    photoset_id: photosetId,
  })

  if (!photoset) {
    res.status(404).end()
    return
  }

  res.set('Cache-Control', 'public, max-age=3600').json({
    id: photoset.id,
    owner: photoset.owner,
    username: photoset.username,
    primary: photoset.primary,
    secret: photoset.secret,
    server: photoset.server,
    farm: photoset.farm,
    counts: {
      views: toNumber(photoset.count_views),
      comments: toNumber(photoset.count_comments),
      photos: toNumber(photoset.count_photos),
      videos: toNumber(photoset.count_videos),
    },
    // eslint-disable-next-line no-underscore-dangle
    title: photoset.title?._content,
    // eslint-disable-next-line no-underscore-dangle
    description: photoset.description?._content,
    dateCreated: new Date(toNumber(photoset.date_create) * 1000),
    dateUpdated: new Date(toNumber(photoset.date_update) * 1000),
  })
}

export default photosetsGetInfoController
