import { Router } from 'express'

const router = Router()
import { createToken } from '../controllers/auth'

router.post('/create-token', createToken)

export default router