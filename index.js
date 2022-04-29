const express = require('express')
const app = express()
const memberRoutes = require('./backend/routes/memberRoutes')
const connectDB = require('./backend/config/db')
const dotenv = require("dotenv").config()
const {errorMiddleware} = require('./backend/middleware/errorMiddleware')

const PORT = process.env.PORT || 5000

connectDB()

app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.get('/', (req, res) => {
    res.status(400)
})


app.use('/api/members', memberRoutes)

app.use(errorMiddleware) //Should be below of the routers

app.listen(PORT, () => console.log(`Listening on PORT: ${PORT}`))

