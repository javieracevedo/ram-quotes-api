import { Quote } from './quote.model'
import mongoose from 'mongoose'
import { Character } from '../character/character.model'

export const createOne = async (req, res) => {
  if (!req.body.quote)
    return res.status(400).send({ message: 'Quote property is required.' })

  if (!req.body.character)
    return res.status(400).send({ message: 'Character property is required.' })

  const isValidId = mongoose.Types.ObjectId.isValid(req.body.character)
  if (!isValidId) {
    return res.status(400).send({
      message: `Character with id ${req.body.character} is not valid.`
    })
  }

  const characterExist = await Character.exists({ _id: req.body.character })
  if (!characterExist) {
    return res.status(404).send({
      message: `Character with id ${req.body.character} does not exist.`
    })
  }

  try {
    const doc = await Quote.create({ ...req.body, createdBy: req.user._id })
    return res.status(201).json({ data: doc })
  } catch (e) {
    return res.status(500).send({ error: e })
  }
}

// TODO: should be public
export const getOne = async (req, res) => {
  if (!req.params.id)
    return res.status(400).send({ message: 'Quote id param is required.' })

  // TODO: make this in to a middleware maybe?
  const isValidId = mongoose.Types.ObjectId.isValid(req.params.id)
  if (!isValidId) {
    return res
      .status(400)
      .send({ message: `Quote with id ${req.params.id} is not valid.` })
  }

  try {
    const doc = await Quote.findById(req.params.id)
      .lean()
      .exec()
    if (!doc) {
      return res
        .status(404)
        .send({ message: `Quote with id ${req.params.id} does not exist.` })
    }
    return res.status(201).json({ data: doc })
  } catch (e) {
    console.log('ERROR: ', e)
    return res.status(500).send({ error: e })
  }
}

// TODO: Should be the only one, always by id and use limit to get the amount you need
// TODO: should be public
export const getMany = async (req, res) => {
  const isValidId = mongoose.Types.ObjectId.isValid(req.query.character_id)
  if (req.query.character_id && !isValidId) {
    return res.status(400).send({
      message: `Character id ${req.query.character_id} is not valid.`
    })
  }

  try {
    const limit = Number(req.query.limit) || 25
    const query = req.query.character_id ? { character: req.character_id } : {}

    const doc = await Quote.find(query)
      .limit(limit)
      .lean()
      .exec()
    return res.status(200).json({ data: doc })
  } catch (e) {
    console.log(e)
    return res.status(500).send({ message: e })
  }
}

// export const updateOne = async (req, res) => {

// }

export default {
  createOne,
  getMany
}
