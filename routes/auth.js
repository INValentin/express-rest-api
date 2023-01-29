import { Router } from 'express'

const router = Router()
import { createToken } from '../controllers/auth'

router.post('/login', createToken)

export default router