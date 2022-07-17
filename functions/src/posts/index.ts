import express from 'express'
import renderContentController from './render-content.js'
import renderPostController from './render-post.js'
import {
  cors, errorHandler, notFound, serverTiming,
} from '../utils/middlewares/index.js'

const app = express()

app.disable('x-powered-by')
app.use(cors())
app.use(serverTiming())

app.post('/render', renderContentController)
app.get('/render/:postId', renderPostController)

app.use(notFound)
app.use(errorHandler)

export default app
