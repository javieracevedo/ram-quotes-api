import { Quote } from './quote.model'

export const createOne = async (req, res) => {
  if (!req.body.quote)
    return res.status(400).send({ message: 'Quote property is required.' })
}

export default {
  createOne
}
