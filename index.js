const express = require('express')

const mongoose = require('mongoose')
mongoose.set('strictQuery', false);

require('dotenv').config()
const blogRoutes = require('./routes/blog')

const app = express()
app.use(express.json())

app.use('/blogs', blogRoutes)

const init = async () => {
    await mongoose.connect(process.env.DB_URL)
    app.listen(6000, () => console.log('Listening on 6000'))
}

init()