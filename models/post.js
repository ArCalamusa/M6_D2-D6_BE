import mongoose from "mongoose"

const PostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    img: {
        type: String,
        required: false,
        default: 'https://picsum.photos/1920/1080'
    },
    author: {
        type: String,
        required: false,
        default: 'admin'
    },
    rate: {
        type: Number,
        required: false,
        max: 5,
        min: 0,
        default: 0
    }
}, { timestamps: true, strict: true })

const PostModel = mongoose.model('postModel', PostSchema, 'post')
export default PostModel
