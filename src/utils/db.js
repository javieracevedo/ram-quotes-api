import mongoose from 'mongoose'
import { map } from 'lodash'

const remove = collection =>
  new Promise((resolve, reject) => {
    collection.remove(err => {
      if (err) return reject(err)
      resolve()
    })
  })

const clearDB = () => {
  // eslint-disable-next-line new-cap
  return Promise.all(map(mongoose.connection.collections, c => remove(c)))
}

export default {
  clearDB
}
