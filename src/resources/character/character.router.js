import { Router } from 'express'
import controllers from './character.controllers'

const router = Router()

router.route('/').post(controllers.createOne)
router.route('/:id').get(controllers.getOne)
router.route('/').get(controllers.getOne)

export default router
