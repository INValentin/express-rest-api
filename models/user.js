import { Schema, model } from 'mongoose'

const userSchema = new Schema(({
    username: { type: String, required: true },
    password: { type: String, required: true },
    fullName: { type: String, required: true },
    userType: { type: String, default: 'user' }
}))

const User = model('User', userSchema)
export default User

