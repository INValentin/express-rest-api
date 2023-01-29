import { Schema, model } from 'mongoose'

const blogSchema = new Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: String, required: true },
    comments: [{ id: Number, user: String, comment: String }]
}, { timestamps: true })


const Blog = model('blogs', blogSchema)
export default Blog