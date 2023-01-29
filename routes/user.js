import { Router } from 'express'
import { getAllUsers, getUser, updateUser, deleteUser, createUser } from '../controllers/user'

const router = Router()

router.get('/', getAllUsers)
router.post('/', createUser)
router.get('/:id', getUser)
router.put('/:id', updateUser)
router.delete('/:id', deleteUser)


export default router