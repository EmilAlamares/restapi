const express = require('express')
const router = express.Router()
const { getMember, registerMember, loginMember, updateMember, deleteMember } = require('../controller/memberController')
const {authenticateToken} = require('../middleware/authMiddeware')

router.route('/').post(registerMember).get(authenticateToken, getMember).put(authenticateToken, updateMember).delete(authenticateToken, deleteMember)
router.post('/login', loginMember)

module.exports = router