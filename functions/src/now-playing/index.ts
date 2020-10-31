import * as express from 'express'
import * as ejs from 'ejs'
import nowPlayingController from './now-playing'
import nowPlayingSvgController from './now-playing-svg'
import { handlerCatch } from '../utils/decorators'
import { cors, errorHandler, notFound } from '../utils/middlewares'

const app = express()

app.disable('x-powered-by')
app.engine('.ejs', ejs.renderFile)
app.use(cors())

app.get('/', handlerCatch(nowPlayingController))
app.get('/svg', handlerCatch(nowPlayingSvgController))
app.get('/:user', handlerCatch(nowPlayingController))
app.get('/:user/svg', handlerCatch(nowPlayingSvgController))

app.use(notFound)
app.use(errorHandler)

export default app
