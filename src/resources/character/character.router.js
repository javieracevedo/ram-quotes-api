import { Router } from 'express'
import controllers from './character.controller'

const router = Router()

router.route('/').post(controllers.createOne)
router.route('/').get(controllers.getOne)

export default router
