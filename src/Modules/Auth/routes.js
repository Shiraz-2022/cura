const express = require('express');
const router = express.Router();
const { authController, authMiddleware } = require('./controller');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/verify', authMiddleware.verifyToken, (req, res) => {
    res.json({ user: req.user });
});
router.post('/update-user-details', authMiddleware.verifyToken, authController.updateUserDetails);
router.get('/users', authMiddleware.verifyToken, authController.getUsers);
router.get('/users/:userId', authMiddleware.verifyToken, authController.getUserById);

module.exports = router