const { Message } = require('./model')
const { User } = require('../Auth/model')

const chatController = {
  getUsers: async (req, res) => {
    try {
      const users = await User.find({ _id: { $ne: req.user._id } })
        .select('-password')
      res.json(users)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  },

  getMessages: async (req, res) => {
    try {
      const messages = await Message.find({
        $or: [
          { sender: req.user._id, receiver: req.params.userId },
          { sender: req.params.userId, receiver: req.user._id }
        ]
      }).sort({ createdAt: 1 })
      res.json(messages)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  },

  sendMessage: async (req, res) => {
    try {
      const message = new Message({
        sender: req.user._id,
        receiver: req.body.receiverId,
        content: req.body.content
      })
      await message.save()
      res.status(201).json(message)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }
}

module.exports = { chatController }