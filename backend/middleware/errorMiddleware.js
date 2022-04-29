const express = require("express")

const errorMiddleware = (err, req, res, next) => {
  const statuscode = res.statuscode ? res.statuscode : 500

  res.status(statuscode)
  res.json({ msg: err.message, stack: err.stack})
}

module.exports = { errorMiddleware }
