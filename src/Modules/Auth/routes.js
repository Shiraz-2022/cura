const express = require('express');
const router = express.Router();
const { authController, authMiddleware } = require('./controller');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/verify', (req, res) => {
    res.json({ user: req.user });
});
router.post('/update-user-details', authController.updateUserDetails);
router.get('/users', authController.getUsers);
router.get('/users/:userId', authController.getUserById);

module.exports = router