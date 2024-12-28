const jwt = require('jsonwebtoken');
const { User } = require('./model');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const JWT_SECRET = process.env.JWT_SECRET || crypto.randomBytes(64).toString('hex');
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

const authMiddleware = {
  verifyToken: async (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }
      req.user = user;
      next();
    } catch (error) {
      res.status(401).json({ message: 'Token is not valid' });
    }
  },

  generateToken: (user) => {
    return jwt.sign(
      { id: user._id }, 
      JWT_SECRET, 
      { expiresIn: JWT_EXPIRES_IN }
    );
  }
};

const authController = {
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(400).json({ message: 'Email not registered' });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      const token = authMiddleware.generateToken(user);
      const userResponse = user.toObject();
      delete userResponse.password;

      res.status(200).json({ user: userResponse, token });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  },

  register: async (req, res) => {
    try {
      const { name, email, password } = req.body;
      const existingUser = await User.findOne({ email });

      if (existingUser) {
        return res.status(400).json({ message: 'Email already registered' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = new User({
        name,
        email,
        password: hashedPassword
      });

      await user.save();

      const token = authMiddleware.generateToken(user);
      const userResponse = user.toObject();
      delete userResponse.password;

      res.status(201).json({ user: userResponse, token });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  },

  getUsers: async (req, res) => {
    try {
      const users = await User.find({})
        .select('-password')
        .sort({ lastActive: -1 })
      res.status(200).json(users)
    } catch (error) {
      res.status(500).json({ message: 'Error fetching users' })
    }
  },

  updateUserDetails: async (req, res) => {
    try {
      const userId = req.user._id
      const updates = req.body
      const allowedUpdates = ['name', 'age', 'location']
      const updateFields = {}

      Object.keys(updates).forEach(key => {
        if (allowedUpdates.includes(key)) {
          updateFields[key] = updates[key]
        }
      })

      const user = await User.findByIdAndUpdate(
        userId,
        updateFields,
        { new: true, runValidators: true }
      ).select('-password')

      if (!user) {
        return res.status(404).json({ message: 'User not found' })
      }

      res.status(200).json({ user })
    } catch (error) {
      res.status(500).json({ message: 'Server error' })
    }
  }
};

module.exports = {
  authMiddleware,
  authController,
};
