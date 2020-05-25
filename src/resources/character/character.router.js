import { Router } from 'express'
import controllers from './character.controllers'

const router = Router()

router.route('/').post(controllers.createOne)

router.route('/:id').get(controllers.getOne)
router.route('/').get(controllers.getMany)

router.route('/:id').put(controllers.updateOne)
router.route('/').put(controllers.updateOne)

router.route('/:id').delete(controllers.deleteOne)

export default router
