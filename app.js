const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require('body-parser')
const connectDB = require('./DB')
require('dotenv').config()

const app = express()

//middleware
app.use(bodyParser.json());

// routes
const userRoute = require('./Routes/userRoutes')
app.use('/user', userRoute)

connectDB()

const PORT = process.env.PORT || 8000 ;
app.listen(PORT, ()=>{
    console.log(`server is running on port ${PORT}`)
})



