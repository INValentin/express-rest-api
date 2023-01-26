const router = require('express').Router()

import {
    getAllUsers,
    getUser,
    updateUser,
    deleteUser,
    createUser
} from '../controllers/user'


router.get('/', getAllUsers)
router.post('/', createUser)
router.get('/:id', getUser)
router.put('/:id', updateUser)
router.delete('/:id', deleteUser)


module.exports = router