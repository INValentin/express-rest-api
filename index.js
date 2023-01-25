const express = require('express')

const mongoose = require('mongoose')
mongoose.set('strictQuery', false);

require('dotenv').config()
const blogRoutes = require('./routes/blog')

const app = express()
app.use(express.json())

app.use('/blogs', blogRoutes)

const init = async () => {
    try {
        await mongoose.connect(process.env.DB_URL)
        console.log("DB Connected!");
        app.listen(6000, () => console.log('Listening on 6000'))
    } catch (error) {
     console.log("\n\nDatabase connection failed: \n", error)   
    }
}

init()