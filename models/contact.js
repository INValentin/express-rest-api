import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    message: { type: String, required: true },
    email: { type: String, required: true }
}, { timestamps: true })


export default mongoose.model('blog_contacts', contactSchema)