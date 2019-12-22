import * as express from 'express'
import renderContentController from './render-content'
import renderPostController from './render-post'
import { cors, errorHandler, notFound } from '../utils/middlewares'

const app = express()

app.disable('x-powered-by')
app.use(cors())

app.post('/render', renderContentController)
app.get('/render/:postId', renderPostController)

app.use(notFound)
app.use(errorHandler)

export default app
