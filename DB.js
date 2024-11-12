const mongoose = require('mongoose')
require('dotenv').config();


const connectDB = async () =>{
    try {
        await mongoose.connect(process.env.DB_URL , {
            useNewUrlParser : true,
            useUnifiedTopology : true
        })
        console.log("DB connected successfully")
    } catch (error) {
        console.log('DB connection error', error)
        process.exit(1)
    }
}

module.exports = connectDB ;

// const DB_URL = process.env.DB_URL ;


