import { Character } from './character.model'
import { User } from '../user/user.model'
import mongoose from 'mongoose'

export const getOne = async (req, res) => {
  if (req.params.id) {
    const isValidId = mongoose.Types.ObjectId.isValid(req.params.id)
    if (!isValidId) {
      return res
        .status(400)
        .send({ message: `Character id ${req.params.id} is not a valid id.` })
    }
    const characterExists = await Character.exists({ _id: req.params.id })
    if (!characterExists) {
      return res.status(404).send({
        message: `Character with id ${req.params.id} doesn't exist.`
      })
    }
  } else if (req.query.name) {
    const characterExists = await Character.exists({ name: req.query.name })
    if (!characterExists) {
      return res.status(404).send({
        message: `Character with name ${req.query.name} doesn't exist.`
      })
    }
  } else {
    return res.status(400).send({
      message: 'Either id parameter or name query parameter must be present.'
    })
  }

  try {
    const doc = await Character.findOne({ _id: req.params.id })
      .lean()
      .exec()

    if (!doc) {
      return res.status(400).end()
    }

    res.status(200).json({ data: doc })
  } catch (e) {
    console.error(e)
    res.status(400).end()
  }
}

// TODO: add getMany characters
export const getMany = async (req, res) => {
  try {
    let doc = await Character.find({})
    doc = doc.map(record => {
      return { id: record._id, name: record.name }
    })
    return res.status(200).json({ data: doc })
  } catch (e) {
    return res.status(500).send({ message: e })
  }
}

export const createOne = async (req, res) => {
  if (!req.body.name)
    return res.status(400).send({ message: 'name property is required.' })

  const characterExists = await Character.exists({ name: req.body.name })
  if (characterExists) {
    return res
      .status(403)
      .send({ message: `Character ${req.body.name} already exists.` })
  }

  const userExists = await User.exists(req.user)
  if (!userExists) {
    res
      .status(404)
      .send({ message: `User with id ${req.user._id} doesn't exist.` })
    return
  }

  try {
    const doc = await Character.create({ ...req.body, createdBy: req.user._id })
    res.status(201).json({ data: doc })
  } catch (e) {
    res.status(500).send({ error: e })
  }
}

export const deleteOne = async (req, res) => {
  if (!req.params.id) {
    return res.status(400).send({ message: 'Character id must be present' })
  }

  const isValidId = mongoose.Types.ObjectId.isValid(req.params.id)
  if (!isValidId) {
    return res
      .status(400)
      .send({ message: `Character with id ${req.params.id} is not valid.` })
  }

  const characterExists = await Character.exists({ _id: req.params.id })
  if (!characterExists) {
    return res
      .status(404)
      .send({ message: `Character with id ${req.params.id} doesn't exist.` })
  }

  try {
    // TODO: use findOneAndDelete instead to avoid having to check whether the character exists
    const doc = await Character.deleteOne({ _id: req.params.id })
    res.status(201).json({ data: doc })
  } catch (e) {
    res.status(500).send({ error: e })
  }
}

export const updateOne = async (req, res) => {
  const characterId = req.params.id ? req.params.id : req.body._id
  if (!characterId) {
    return res.status(400).send({
      message: 'Neither param id or id in body is present in request.'
    })
  }

  const isValidId = mongoose.Types.ObjectId.isValid(characterId)
  if (!isValidId) {
    return res
      .status(400)
      .send({ message: `Character with id ${characterId} is not valid.` })
  }

  const characterExists = await Character.exists({ _id: characterId })
  if (!characterExists) {
    return res
      .status(404)
      .send({ message: `Character with id ${characterId} doesn't exist.` })
  }

  try {
    const doc = await Character.findByIdAndUpdate(
      characterId,
      { name: req.body.name },
      { new: true }
    )
      .lean()
      .exec()
    res.status(201).json({ data: doc })
  } catch (e) {
    if (e.codeName === 'DuplicateKey') {
      res.status(403).send({
        message: `Character with name ${req.body.name} already exists.`
      })
    }
    res.status(500).send({ error: e })
  }
}

export default {
  createOne,
  deleteOne,
  getOne,
  getMany,
  updateOne
}
