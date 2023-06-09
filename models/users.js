import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        max: 30
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    }
}, { timestamps: true, strict: true })

const UserModel = mongoose.model('userModel', UserSchema, 'users')
export default UserModel