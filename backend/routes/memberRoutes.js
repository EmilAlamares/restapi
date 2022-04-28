const express = require('express')
const router = express.Router()
const { getMembers, registerMember, loginMember } = require('../controller/memberController')

router.get('/', getMembers)
router.post('/', registerMember)
router.post('/login', loginMember)

module.exports = router