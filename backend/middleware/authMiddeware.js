const jwt = require("jsonwebtoken")
const asyncHandler = require("express-async-handler")
const Member = require("../models/memberModel")

const authenticateToken = asyncHandler(async (req, res, next) => {
  let token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      //Get token
      token = req.headers.authorization.split(" ")[1]
      const decode = jwt.verify(token, process.env.JWT_SECRET)
      req.member = await Member.findById(decode.id).select("-password")
    } catch (err) {
      throw new Error(`Not authorized.`)
    }

    if (!req.member) {
      res.status(401)
      throw new Error("Member does not exist.")
    }
    next()
  } else {
    res.status(401)
    throw new Error("Bad token.")
  }

  if (!token) {
    res.status(401)
    throw new Error("No token, not authorized.")
  }
})

module.exports = { authenticateToken }
