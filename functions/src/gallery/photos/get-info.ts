/* eslint-disable no-underscore-dangle */
import { RequestHandler } from 'express'
import * as functions from 'firebase-functions'
import { photos } from '../../utils/logic/flickr.js'
import { toNumber } from '../../utils/helpers.js'

const photosGetInfoController: RequestHandler = async (req, res) => {
  const { photoId } = req.params

  const [{ photo }, { photo: exif }, { sizes }] = await Promise.all([
    photos.getInfo({ photo_id: photoId }),
    photos.getExif({ photo_id: photoId }),
    photos.getSizes({ photo_id: photoId }),
  ])

  if (!photo || !exif || !sizes || photo.owner.nsid !== functions.config().flickr.user_id) {
    res.status(404).end()
    return
  }

  res.set('Cache-Control', 'public, max-age=3600').json({
    id: photo.id,
    secret: photo.secret,
    server: photo.server,
    farm: photo.farm,
    title: typeof photo.title === 'string' ? photo.title : photo.title?._content,
    description: typeof photo.description === 'string'
      ? photo.description
      : photo.description?._content,
    rotation: toNumber(photo.rotation),
    urls: photo.urls.url.map(({ _content, type }) => ({ type, url: _content })),
    datePosted: new Date(toNumber(photo.dates.posted) * 1000),
    dateUpdated: new Date(toNumber(photo.dates.lastupdate) * 1000),
    dateTaken: photo.dates.taken,
    location: photo.location && {
      latitude: parseFloat(photo.location.latitude),
      longitude: parseFloat(photo.location.longitude),
      accuracy: parseFloat(photo.location.accuracy),
      context: photo.location.context,
      placeId: photo.location.place_id,
      woeid: photo.location.woeid,
      neighbourhood: photo.location.neighbourhood?._content,
      locality: photo.location.locality?._content,
      county: photo.location.county?._content,
      region: photo.location.region?._content,
      country: photo.location.country?._content,
    },
    camera: exif.camera,
    exif: exif.exif.map((e) => ({
      tagspace: e.tagspace,
      tag: e.tag,
      label: e.label,
      value: e.raw._content,
      clean: e.clean?._content,
    })).reduce((obj, { tagspace, tag, ...data }) => ({
      ...obj,
      [tagspace]: {
        ...(obj[tagspace] || {}),
        [tag]: data,
      },
    }), {} as Record<string, any>),
    sizes: sizes.size.map((s) => ({
      label: s.label,
      width: toNumber(s.width),
      height: toNumber(s.height),
      source: s.source,
      url: s.url,
    })),
  })
}

export default photosGetInfoController
