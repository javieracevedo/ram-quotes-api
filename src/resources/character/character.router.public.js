import { Router } from 'express'
import { getMany } from './character.controllers'

const router = Router()

router.route('/').get(getMany)

export default router
