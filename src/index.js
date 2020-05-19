import { start } from './server'
import mongoose from 'mongoose'

(async () => {
  await mongoose.connect('mongodb://localhost:27017/ram-api', {
    useNewUrlParser: true,
    autoIndex: true,
    poolSize: 10,
    useUnifiedTopology: true
  })

  start()
})()
