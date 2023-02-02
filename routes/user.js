import { Router } from 'express'
import { getAllUsers, getUser, updateUser, deleteUser, createUser } from '../controllers/user'
import authMiddleware from '../middleware/auth'

const router = Router()

router.get('/', getAllUsers)
router.post('/', authMiddleware, createUser)
router.get('/:id', getUser)
router.put('/:id', authMiddleware, updateUser)
router.delete('/:id', authMiddleware, deleteUser)

export default router