const Member = require("../models/memberModel")
const asyncHandler = require("express-async-handler")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")

// Register a member
// POST api/members
// Public
const registerMember = asyncHandler(async (req, res) => {
  let token
  const { name, username, password } = req.body

  if (!name || !username || !password) {
    res.status(400)
    // res.json({msg: "Invalid data."})
    throw new Error("Invalid data")
  }

  const userExists = await Member.findOne({ username })

  if (userExists) {
    res.status(400)
    throw new Error("User already exists.")
  }

  salt = await bcrypt.genSalt(10)
  hashedPassword = await bcrypt.hash(password, salt)

  const member = await Member.create({
    name,
    username,
    password: hashedPassword,
  })

  if (member) {
    res.status(200)
    res.json({
      name,
      username,
      password: hashedPassword,
      token: generateToken(member._id),
    })
  } else {
    res.status(400)
    res.json("Invalid user data.")
  }
})

// Get member data
// GET api/members/
// Private
const getMember = asyncHandler(async (req, res) => {
  res.status(200)
  res.json(req.member)

})

// Update member data
// PUT api/members
// Private
const updateMember = asyncHandler(async (req, res) => {
  let updatedMember
  const { id } = req.member
  const { name, password } = req.body

  //Check if there's at least 1 data.
  if (!name && !password) {
    res.status(400)
    throw new Error("Please input at least 1 data.")
  }

  //Hash the password if there's any
  if (password) {
    salt = await bcrypt.genSalt(10)
    hashedPassword = await bcrypt.hash(password, salt)
  }

  //Updating the member
  try {
    updatedMember = await Member.findByIdAndUpdate(
      id,
      {
        name: req.body.name ? req.body.name : req.member.name,
        password: req.body.password ? hashedPassword : req.member.password,
      },
      { new: true }
    )
  } catch (err) {
    res.status(500)
    throw new Error("Something went wrong.")
  }
  res.status(200)
  res.json(updatedMember)
})

// Delete member data
// Delete api/members
// Private
const deleteMember = asyncHandler(async (req, res) => {
  let deletedMember
  const { id } = req.member

  //Deleting the member
  try {
    deletedMember = await Member.findOneAndDelete({ _id: id })
  } catch (err) {
    res.status(500)
    throw new Error("Something went wrong.")
  }
  res.status(200)
  res.json({
    msg: "The following member has been deleted",
    member: deletedMember,
  })
})

// Login a member
// POST api/members/login
// Public
const loginMember = asyncHandler(async (req, res) => {
  const { username, password } = req.body

  if (!username || !password) {
    res.status(400)
    throw new Error("Please fill all fields.")
  }

  const member = await Member.findOne({ username })
  //Checking user credentials
  if (member && (await bcrypt.compare(password, member.password))) {
    res.status(200)
    res.json({
      id: member.id,
      name: member.name,
      username: member.username,
      password: member.password,
      token: generateToken(member._id),
    })
  } else {
    res.status(400)
    throw new Error("Invalid credentials.")
  }
})

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" })
}
module.exports = {
  getMember,
  registerMember,
  loginMember,
  updateMember,
  deleteMember,
}
