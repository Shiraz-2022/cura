const express = require('express');
const { chatbotController } = require('./controller');
const { authMiddleware } = require('../Auth/controller');
const router = express.Router();

router.post('/chat', authMiddleware.verifyToken, chatbotController.handleChat);

module.exports = router;
