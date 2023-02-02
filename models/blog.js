import { Schema, model } from 'mongoose'
import { registerSchema } from 'swaggiffy'

const blogSchema = new Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: String, required: true },
    comments: [{ id: Number, user: String, comment: String }]
}, { timestamps: true })


const Blog = model('blogs', blogSchema)
registerSchema('Blog', blogSchema, { orm: 'mongoose' })

export default Blog