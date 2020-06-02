import { Router } from 'express'
import quoteController from './quote.controller'

const router = Router()

router.post('/', quoteController.createOne)
router.delete('/:id', quoteController.deleteOne)

export default router
