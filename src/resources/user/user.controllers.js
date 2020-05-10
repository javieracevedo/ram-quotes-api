import { User } from './user.model'
import mongoose from 'mongoose'

export const me = (req, res) => {
  res.status(200).json({ data: req.user })
}

export const updateMe = async (req, res) => {
  const userId = req.params.user_id

  const isValidOBjectId = mongoose.Types.ObjectId.isValid(userId)
  if (!isValidOBjectId) {
    res.status(400).send({ message: 'Invalid user object id.' })
    return
  }

  try {
    const user = await User.findByIdAndUpdate(userId, req.body, {
      new: true
    })
      .lean()
      .exec()

    if (!user) {
      res.status(404).send({ message: 'User not found.' })
      return
    }

    res.status(202).json({ data: user })
  } catch (e) {
    console.log(e)
    res.status(500).end({ message: e })
  }
}
