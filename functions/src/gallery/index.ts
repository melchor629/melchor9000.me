import express from 'express'
import {
  photosetsGetListController,
  photosetsGetInfoController,
  photosetsGetPhotosController,
} from './photosets/index.js'
import { photosGetController, photosGetInfoController } from './photos/index.js'
import { handlerCatch } from '../utils/decorators/index.js'
import {
  cors, errorHandler, notFound, serverTiming,
} from '../utils/middlewares/index.js'

const app = express()

app.disable('x-powered-by')
app.use(cors())
app.use(serverTiming())

app.get('/photosets', handlerCatch(photosetsGetListController))
app.get('/photosets/:photosetId', handlerCatch(photosetsGetInfoController))
app.get('/photosets/:photosetId/photos', handlerCatch(photosetsGetPhotosController))
app.get('/photos', handlerCatch(photosGetController))
app.get('/photos/:photoId', handlerCatch(photosGetInfoController))

app.use(notFound)
app.use(errorHandler)

export default app
