const Task = require("../models/taskModel")
const asyncHandler = require("express-async-handler")

// Get member's tasks.
// GET api/members/tasks
// Private
const getTasks = asyncHandler(async (req, res) => {
  const { id } = req.member
  const task = await Task.find({ memberAssigned: id })

  res.status(200).json({ task })
})

// Create a member's task.
// POST api/members/tasks
// Private
const createTask = asyncHandler(async (req, res) => {
  const { _id } = req.member
  const taskDescription = req.body.task

  if (!taskDescription) {
    res.status(400)
    throw new Error("No task input.")
  }
  try {
    const task = await Task.create({
      memberAssigned: _id,
      taskDescription,
      dateAssigned: Date(),
    })
    res.status(201).json(task)
  } catch (err) {
    res.status(400)
    throw new Error(`Something went wrong! ${err}`)
  }
})

// Update a member's task.
// PUT api/members/tasks/:id
// Private
const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id)
  if (!task) {
    res.status(400)
    throw new Error(`Task does not exist.`)
  }
  
  // Check if the member logged in, matches the
  // assigned member in the task.
  const memberMatch = task.memberAssigned == req.member.id
  if (!memberMatch) {
    res.status(401)
    throw new Error(
      "Member assigned to task does not match the member currently logged in."
    )
  }

  //Check for task input
  if (!req.body.task) {
    res.status(400)
    throw new Error("No task input.")
  }
  //new set to true, means the returning value of the findByIdAndUpdate would
  //be the updated document (otherwise it will return the matched document BEFORE the update.)
  const updatedTask = await Task.findByIdAndUpdate(
    req.params.id,
    { taskDescription: req.body.task },
    { new: true }
  )
  res.status(200)
  res.json({ updatedTask })
})

// Delete a member's task.
// DELETE api/members/tasks/:id
// Private
const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id)
  if (!task) {
    res.status(400)
    throw new Error(`Task does not exist.`)
  }

  // Check if the member logged in, matches the
  // assigned member in the task.
  const memberMatch = task.memberAssigned == req.member.id
  if (!memberMatch) {
    res.status(401)
    throw new Error(
      "Member assigned to task does not match the member currently logged in."
    )
  }

  const deletedTask = await Task.findByIdAndDelete(req.params.id)
  res.status(200)
  res.json([
    { msg: "The following task has been deleted successfully." },
    { deletedTask },
  ])
})

module.exports = { getTasks, createTask, updateTask, deleteTask }
