const mongoose = require("mongoose")

const memberSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name."],
    },
    username: {
      type: String,
      required: [true, "Please add a username."],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please add a username."],
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Member', memberSchema)
