const { Chat, Message } = require('./model')

const chatController = {
    initiateChat: async (req, res) => {
        try {
            const { receiverId } = req.body
            const senderId = req.user._id

            let chat = await Chat.findOne({
                participants: {
                    $all: [senderId, receiverId]
                }
            }).populate('participants', 'name email profileImage')

            if (!chat) {
                chat = await Chat.create({
                    participants: [senderId, receiverId]
                })
                chat = await chat.populate('participants', 'name email profileImage')
            }

            res.status(200).json(chat)
        } catch (error) {
            console.error('Chat initiation error:', error)
            res.status(500).json({ message: error.message })
        }
    },

    getChatByUsers: async (req, res) => {
        try {
            const { userId, receiverId } = req.params
            const chat = await Chat.findOne({
                participants: {
                    $all: [userId, receiverId]
                }
            }).populate('participants', 'name email profileImage')

            if (!chat) {
                return res.status(404).json({ message: 'Chat not found' })
            }

            res.status(200).json(chat)
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    },

    getChatMessages: async (req, res) => {
        try {
            const { chatId } = req.params
            const messages = await Message.find({ chatId })
                .populate('sender', 'name email profileImage')
                .populate('receiver', 'name email profileImage')
                .sort({ createdAt: 1 })

            res.status(200).json(messages)
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    },

    sendMessage: async (req, res) => {
        try {
            const { chatId, receiverId, content } = req.body
            const senderId = req.user._id

            const message = await Message.create({
                chatId,
                sender: senderId,
                receiver: receiverId,
                content
            })

            await Chat.findByIdAndUpdate(chatId, {
                lastMessage: message._id,
                lastMessageAt: new Date()
            })

            await message.populate([
                { path: 'sender', select: 'name email profileImage' },
                { path: 'receiver', select: 'name email profileImage' }
            ])

            res.status(201).json(message)
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    },

    getChatHistory: async (req, res) => {
        try {
            const userId = req.user._id
            const chats = await Chat.find({
                participants: userId
            })
            .populate('participants', 'name email profileImage')
            .populate('lastMessage')
            .sort({ lastMessageAt: -1 })

            res.status(200).json(chats)
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    }
}

module.exports = { chatController }