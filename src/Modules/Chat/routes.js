const express = require('express')
const router = express.Router()
const { chatController } = require('./controller')
const { authMiddleware } = require('../Auth/controller')

router.get('/users', authMiddleware.verifyToken, chatController.getUsers)
router.get('/messages/:userId', authMiddleware.verifyToken, chatController.getMessages)
router.post('/send', authMiddleware.verifyToken, chatController.sendMessage)

module.exports = router