const router = require('express').Router()

const {
    getAllUsers,
    getUser,
    updateUser,
    deleteUser,
    createUser
} = require('../controllers/user')


router.get('/', getAllUsers)
router.post('/', createUser)
router.get('/:id', getUser)
router.put('/:id', updateUser)
router.delete('/:id', deleteUser)


module.exports = router