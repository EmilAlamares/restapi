const mongoose = require("mongoose")
const Member = require("../models/memberModel")
const asyncHandler = require("express-async-handler")

// GET members - Get all registered members
// api/members
// Public
const getMembers = asyncHandler(async (req, res) => {
  const members = await Member.find()
  res.status(200)
  res.json(members)
})

// POST member -- Register a member
// api/members
// Private
const registerMember = asyncHandler(async (req, res) => {
  const { name, username, password } = req.body

  if (!name || !username || !password) {
    res.status(400)
    // res.json({msg: "Invalid data."})
    throw new Error("Invalid data")
  }

  const member = await Member.create({
    name,
    username,
    password,
  })

  res.status(200).json(member)
})

// POST member -- Login a member
// api/members/login
// Public
const loginMember = asyncHandler(async (req, res) => {
  const { username, password } = req.body

  if (!username || !password) {
    res.status(400)
    throw new Error("Please fill all fields.")
  }

  const member = await Member.findOne({ username })

  if (member && member.password === password) {
    res.status(200)
    res.json(member)
  } else {
      res.status(400)
      throw new Error ('Invalid credentials.')
  }

})

module.exports = { getMembers, registerMember, loginMember }
