import { Schema, model } from 'mongoose'
import { registerSchema } from 'swaggiffy';

const userSchema = new Schema(({
    username: { type: String, required: true },
    password: { type: String, required: true },
    fullName: { type: String, required: true },
    userType: { type: String, default: 'user' },
    subscriberEmail: String
}))

const User = model('User', userSchema)

registerSchema('User', userSchema, { orm: 'mongoose' })
export default User

