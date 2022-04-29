const express = require('express')
const router = express.Router()
const {getTasks, createTask, updateTask, deleteTask} = require('../controller/taskController')
const {authenticateToken} = require('../middleware/authMiddeware')


router.route('/').get(authenticateToken, getTasks).post(authenticateToken, createTask)
router.route('/:id').put(authenticateToken,updateTask).delete(authenticateToken, deleteTask)

module.exports = router
