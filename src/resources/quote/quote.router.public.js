import { Router } from 'express'
import { getOne } from './quote.controller'

const router = Router()

router.get('/', getOne)

export default router
