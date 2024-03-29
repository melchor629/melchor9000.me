import express from 'express'
import ejs from 'ejs'
import nowPlayingController from './now-playing.js'
import nowPlayingSvgController from './now-playing-svg.js'
import { handlerCatch } from '../utils/decorators/index.js'
import {
  cors, errorHandler, notFound, serverTiming,
} from '../utils/middlewares/index.js'

const app = express()

app.disable('x-powered-by')
app.engine('.ejs', ejs.renderFile)
app.use(serverTiming())

app.get('/', cors(), handlerCatch(nowPlayingController))
app.get('/svg', handlerCatch(nowPlayingSvgController))
app.get('/:user', cors(), handlerCatch(nowPlayingController))
app.get('/:user/svg', handlerCatch(nowPlayingSvgController))

app.use(notFound)
app.use(errorHandler)

export default app
