const express = require('express')
const router = express.Router()
const { getMember, registerMember, loginMember } = require('../controller/memberController')
const {authenticateToken} = require('../middleware/authMiddeware')

router.get('/', authenticateToken, getMember)
router.post('/', registerMember)
router.post('/login', loginMember)

module.exports = router