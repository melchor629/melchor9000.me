import express from 'express'
import renderContentController from './render-content'
import renderPostController from './render-post'
import {
  cors, errorHandler, notFound, serverTiming,
} from '../utils/middlewares'

const app = express()

app.disable('x-powered-by')
app.use(cors())
app.use(serverTiming())

app.post('/render', renderContentController)
app.get('/render/:postId', renderPostController)

app.use(notFound)
app.use(errorHandler)

export default app
