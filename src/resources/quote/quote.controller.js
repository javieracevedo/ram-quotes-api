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
// TODO: add support for character name query param.
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
    return res.status(500).send({ error: e })
  }
}

// TODO: add support for character name query param.
export const getMany = async (req, res) => {
  const isValidId = mongoose.Types.ObjectId.isValid(req.query.character_id)
  if (req.query.character_id && !isValidId) {
    return res.status(400).send({
      message: `Character id ${req.query.character_id} is not valid.`
    })
  }

  try {
    const limit = Number(req.query.limit) || 25

    let query = {}
    let characterQuery = {}
    let character

    if (req.query.character_id) {
      query = { character: req.query.character_id }
      characterQuery = { _id: req.query.character_id }
    } else if (req.query.character_name) {
      characterQuery = { name: req.query.character_name }
    }

    if (characterQuery._id || characterQuery.name) {
      character = await Character.findOne(characterQuery)
      if (!character) {
        return res.status(404).send({
          message: `Character with name or id ${req.query.character_name ||
            req.query.character_id} was not found.`
        })
      } else {
        query = { character: character._id }
      }
    }

    let doc = await Quote.find(query)
      .limit(limit)
      .lean()
      .exec()
    doc = doc.map(quote => {
      return { ...quote, character }
    })

    return res.status(200).json({ data: doc })
  } catch (e) {
    return res.status(500).send({ message: e })
  }
}

export const updateOne = async (req, res) => {
  if (!req.params.id) {
    return res.status(400).send({ message: 'Quote id param is required.' })
  }

  const isValidId = mongoose.Types.ObjectId.isValid(req.params.id)
  if (!isValidId) {
    return res.status(400).send({
      message: `Quote provided with id ${req.params.id} is not valid.`
    })
  }

  try {
    const doc = await Quote.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true }
    )
      .lean()
      .exec()

    if (!doc) {
      return res
        .status(404)
        .send({ message: `Quote with id ${req.params.id} was not found.` })
    }

    return res.status(200).json({ data: doc })
  } catch (e) {
    return res.status(500).send({ message: e })
  }
}

export const deleteOne = async (req, res) => {
  if (!req.params.id) {
    return res.status(400).send({ message: 'Quote id param is required.' })
  }

  const isValidId = mongoose.Types.ObjectId.isValid(req.params.id)
  if (!isValidId) {
    return res
      .status(400)
      .send({ message: `Quote with id ${req.params.id} is invalid.` })
  }

  const quoteExist = await Quote.exists({ _id: req.params.id })
  if (!quoteExist) {
    return res
      .status(404)
      .send({ message: `Quote with id ${req.params.id} does not exist.` })
  }

  try {
    const doc = await Quote.deleteOne({ _id: req.params.id })
    return res.status(200).json({ data: doc })
  } catch (e) {
    return res.status(500).send({ message: e })
  }
}

export default {
  createOne,
  getMany,
  getOne,
  deleteOne
}
