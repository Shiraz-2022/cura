const mongoose = require('mongoose')

const ThreadSchema = new mongoose.Schema({
    id: Number,
    Name: String,
    comment: String,
    upvotes: String,
    time: String,
    subThreads: [{ type: mongoose.Schema.Types.Mixed }]
})

const PostSchema = new mongoose.Schema({
    title: { type: String, required: true },
    subtitle: { type: String },
    image: { type: String },
    community: { type: mongoose.Schema.Types.ObjectId, ref: 'Community', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    threads: [ThreadSchema]
}, { timestamps: true })

const Post = mongoose.model('Post', PostSchema)
module.exports = Post