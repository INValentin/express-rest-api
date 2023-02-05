import mongoose, { Schema, model } from 'mongoose'
import { registerSchema } from 'swaggiffy'
import User from './user'

const blogSchema = new Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: String, required: true },
    likes: [{type: mongoose.Types.ObjectId, ref: 'User' }],
    comments: [{ id: Number, user: String, comment: String }]
}, { timestamps: true })

const Blog = model('blogs', blogSchema)
registerSchema('Blog', blogSchema, { orm: 'mongoose' })

export default Blog