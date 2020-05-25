import { Router } from 'express'
import { updateMe } from './user.controllers'

const router = Router()

router.put('/:user_id', updateMe)

export default router
