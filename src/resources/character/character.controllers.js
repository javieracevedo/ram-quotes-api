import { Character } from './character.model'
import { User } from '../user/user.model'
import { isEmpty } from 'lodash'

import mongoose from 'mongoose'

export const getOne = model => async (req, res) => {
  try {
    const doc = await model
      .findOne({ _id: req.params.id })
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

export const createOne = async (req, res) => {
  const characterExists = await Character.exists({ name: req.body.name })

  if (characterExists) {
    return res
      .status(403)
      .send({ message: `Character ${req.body.name} already exists.` })
  }

  // Maybe it's best to get the user from the token rather than the id itself.
  const createdById = req.body.createdBy
  const isValidId = mongoose.Types.ObjectId.isValid(createdById)

  if (!req.body.name)
    return res.status(400).send({ message: 'name property is required.' })

  if (!createdById)
    return res.status(400).send({ message: 'createdBy property is required.' })

  if (!isValidId) {
    res
      .status(400)
      .send({ message: `createdBy id ${createdById} is not valid.` })
    return
  }

  const userIsReal = await User.exists({ _id: createdById })
  if (!userIsReal) {
    res
      .status(404)
      .send({ message: `User with id ${createdById} doesn't exist.` })
    return
  }

  try {
    const doc = await Character.create(req.body)
    res.status(201).json({ data: doc })
  } catch (e) {
    res.status(500).send({ error: e })
  }
}

export default {
  createOne,
  getOne
}
