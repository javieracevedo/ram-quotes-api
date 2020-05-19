import express from 'express'
import { json, urlencoded } from 'body-parser'
import morgan from 'morgan'
import cors from 'cors'
import characterRouter from './resources/character/character.router'
import userRouter from './resources/user/user.router'
import quoteRouter from './resources/quote/quote.router'
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

app.use('/api', protect)
app.use('/api/character', characterRouter)
app.use('/api/user', userRouter)
app.use('/api/quote', quoteRouter)

// app.get('/random', (req, res ) => {
//   res.status(200).send({ message: 'Test' })
// })

export const start = async () => {
  try {
    app.listen(port, () => {
      console.log(`REST API on http://localhost:${port}`)
    })
  } catch (e) {
    console.error(e)
  }
}
