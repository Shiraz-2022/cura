const mongoose = require('mongoose')

const MessageSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    sender: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        required: true
    },
    isReceived: {
        type: Boolean,
        required: true
    }
})

const Message = mongoose.model('Message', MessageSchema)

module.exports = Message