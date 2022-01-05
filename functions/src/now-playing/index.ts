import express from 'express'
import ejs from 'ejs'
import nowPlayingController from './now-playing'
import nowPlayingSvgController from './now-playing-svg'
import { handlerCatch } from '../utils/decorators'
import { cors, errorHandler, notFound } from '../utils/middlewares'

const app = express()

app.disable('x-powered-by')
app.engine('.ejs', ejs.renderFile)

app.get('/', cors(), handlerCatch(nowPlayingController))
app.get('/svg', handlerCatch(nowPlayingSvgController))
app.get('/:user', cors(), handlerCatch(nowPlayingController))
app.get('/:user/svg', handlerCatch(nowPlayingSvgController))

app.use(notFound)
app.use(errorHandler)

export default app
