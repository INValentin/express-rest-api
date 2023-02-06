import { Schema, model } from 'mongoose'
import { registerSchema } from 'swaggiffy';

const userSchema = new Schema(({
    username: { type: String, required: true },
    password: { type: String, required: true },
    fullName: { type: String, required: true },
    userType: { type: String, default: 'user' },
    email: String
}))

const User = model('User', userSchema)

const authSchema = new Schema({
    _id: {type: String, required: false, selected: false},
    username: { required: true, type: String },
    password: { type: String, required: true }
})

registerSchema('Auth', authSchema, { orm: 'mongoose' })
registerSchema('User', userSchema, { orm: 'mongoose' })
export default User

