const express = require('express')
const router = express.Router()
const { chatController } = require('./controller')
const { authMiddleware } = require('../Auth/controller')

router.post('/initiate', authMiddleware.verifyToken, chatController.initiateChat)
router.get('/:userId/:receiverId', authMiddleware.verifyToken, chatController.getChatByUsers)
router.get('/history', authMiddleware.verifyToken, chatController.getChatHistory)
router.get('/:chatId/messages', authMiddleware.verifyToken, chatController.getChatMessages)
router.post('/message', authMiddleware.verifyToken, chatController.sendMessage)

module.exports = router