const mongoose = require("mongoose")

const taskSchema = mongoose.Schema({
  memberAssigned: {
    type: mongoose.Types.ObjectId,
    required: [true, "Please assign a member."],
  },
  task: {
    type: String,
    required: [true, "Please add a task."],
  },
  dateAssigned: { type: Date, required: [true, "Please add a date."] },
})

module.exports = mongoose.Model('Task', taskSchema)
