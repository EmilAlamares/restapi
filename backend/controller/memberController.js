const Member = require("../models/memberModel")
const asyncHandler = require("express-async-handler")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")

// Get member data
// GET api/members/
// Public
const getMember = asyncHandler(async (req, res) => {
  const member = req.member
  if (member)
  {
    res.status(400)
    res.json(member)
  }
  else{
    res.status(401)
    throw new Error ('Something went wrong.')
  }


})

// Register a member
// POST api/members
// Private
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

  if (member && (await(bcrypt.compare(password, member.password)))) {
    res.status(200)
    res.json({
      id: member.id,
      name: member.name,
      username: member.username,
      password: member.password,
      token: generateToken(member._id)
    })
  } else {
    res.status(400)
    throw new Error("Invalid credentials.")
  }
})

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" })
}
module.exports = { getMember, registerMember, loginMember }
