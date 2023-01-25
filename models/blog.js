const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: String, required: true },
    comments: [{ id: Number, user: String, comment: String }]
}, { timestamps: true })


const blog = mongoose.model('blogs', blogSchema)
module.exports = blog