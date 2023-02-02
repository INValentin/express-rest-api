import mongoose from "mongoose";
import { registerSchema } from "swaggiffy";

const contactSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    message: { type: String, required: true },
    email: { type: String, required: true }
}, { timestamps: true })



const Contact = mongoose.model('blog_contacts', contactSchema)
registerSchema('Contact', contactSchema, {orm: 'mongoose'})

export default Contact
