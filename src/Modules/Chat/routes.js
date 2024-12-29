const express = require('express')
const router = express.Router()
const Message = require('./model')

router.get('/messages/:id', async (req, res) => {
    try {
        const message = await Message.findById(req.params.id)
        if (!message) {
            return res.status(404).json({ error: 'Message not found' })
        }
        res.json(message)
    } catch (error) {
        res.status(500).json({ error: 'Server error' })
    }
})

router.get('/messages', async (req, res) => {
    try {
        const messages = await Message.find().sort({ timestamp: -1 })
        res.json(messages)
    } catch (error) {
        res.status(500).json({ error: 'Server error' })
    }
})

module.exports = router