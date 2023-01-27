const router = require('express').Router()
const { createToken } = require('../controllers/auth')

router.post('/create-token', createToken)

module.exports = router