const mongoose = require('mongoose')

const CommentSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    createdAt: { type: Date, default: Date.now },
    replies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }]
}, { timestamps: true })

const PostSchema = new mongoose.Schema({
    title: { type: String, required: true },
    subtitle: { type: String },
    content: { type: String, required: true },
    image: { type: String },
    community: { type: mongoose.Schema.Types.ObjectId, ref: 'Community', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    comments: [CommentSchema]
}, { timestamps: true })

const Post = mongoose.model('Post', PostSchema)
module.exports = Post