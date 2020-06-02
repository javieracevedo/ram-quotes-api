import express from 'express'
import { json, urlencoded } from 'body-parser'
import morgan from 'morgan'
import cors from 'cors'
import characterRouter from './resources/character/character.router'
import characterPublicRouter from './resources/character/character.router.public'
import userRouter from './resources/user/user.router'
import quoteRouter from './resources/quote/quote.router'
import quotePublicRouter from './resources/quote/quote.router.public'
import { signin, signup, protect } from './utils/auth.js'

// TODO: use config files
const port = 4000

export const app = express()

app.disable('x-powered-by')

app.use(cors())
app.use(json())
app.use(urlencoded({ extended: true }))
app.use(morgan('dev'))

app.post('/signin', signin)
app.post('/signup', signup)

app.use('/public/quotes', quotePublicRouter)
app.use('/public/characters', characterPublicRouter)

app.use('/', protect)
app.use('/characters', characterRouter)
app.use('/users', userRouter)
app.use('/quotes', quoteRouter)

export const start = async () => {
  try {
    app.listen(port, () => {
      console.log(`REST API on http://localhost:${port}`)
    })
  } catch (e) {
    console.error(e)
  }
}
