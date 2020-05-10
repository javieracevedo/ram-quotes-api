import { Router } from 'express'
import { me, updateMe } from './user.controllers'

const router = Router()

router.get('/', me)
router.put('/:user_id', updateMe)

export default router
