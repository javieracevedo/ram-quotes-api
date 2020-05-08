import { Character } from '../character/character.model'

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
  // const createdBy = req.user._id
  try {
    const doc = await Character.create({ ...req.body })
    res.status(201).json({ data: doc })
  } catch (e) {
    console.error(e)
    res.status(400).end()
  }
}

export default {
  createOne,
  getOne
}
