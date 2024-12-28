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
      const { email, password } = req.body
      const user = await User.findOne({ email })

      if (!user) {
        return res.status(400).json({ message: 'Email not registered' })
      }

      const isMatch = await bcrypt.compare(password, user.password)

      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' })
      }

      const token = authMiddleware.generateToken(user)

      res.status(200).json({ 
        userId: user._id, 
        token 
      })
    } catch (error) {
      res.status(500).json({ message: 'Server error' })
    }
  },

  register: async (req, res) => {
    try {
      console.log('Request body:', req.body)
      const { email, password, role } = req.body

      if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ message: 'Request body is empty' })
      }

      if (!email || !password) {
        return res.status(400).json({
          message: 'Email and password are required',
          receivedData: { email: !!email, password: !!password },
          body: req.body
        })
      }

      const existingUser = await User.findOne({ email })

      if (existingUser) {
        return res.status(400).json({ message: 'Email already registered' })
      }

      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(password, salt)

      const user = new User({
        email,
        password: hashedPassword,
        role: role || 'user'
      })

      const savedUser = await user.save()

      const token = authMiddleware.generateToken(savedUser)

      res.status(201).json({ 
        userId: savedUser._id,
        email: savedUser.email,
        role: savedUser.role,
        token 
      })
    } catch (error) {
      console.error('Registration error:', error)
      res.status(500).json({ 
        message: 'Server error',
        error: error.message,
        body: req.body 
      })
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
     
      const { userId,name, age, location } = req.body
      const updateFields = {}
  
      if (name) updateFields.name = name
      if (age) updateFields.age = age
      if (location && location.name && Array.isArray(location.coordinates)) {
        updateFields.location = {
          name: location.name,
          coordinates: location.coordinates
        }
      }
  
      const user = await User.findByIdAndUpdate(
        userId,
        updateFields,
        { new: true, runValidators: true }
      ).select('-password')
  
      if (!user) {
        console.error(`User update failed - ID: ${userId}`, {
          requestBody: req.body,
          updateFields
        })
        return res.status(404).json({ message: 'User not found' })
      }
  
      console.log(`User updated successfully - ID: ${userId}`, {
        requestBody: req.body,
        updatedUser: user
      })
      res.status(200).json({ user })
    } catch (error) {
      console.error('User update error:', {
        userId: req.user?._id,
        requestBody: req.body,
        error: {
          name: error.name,
          message: error.message,
          code: error.code,
          stack: error.stack
        }
      })
  
      if (error.name === 'ValidationError') {
        return res.status(400).json({ 
          message: 'Validation error', 
          details: Object.values(error.errors).map(err => err.message)
        })
      }
  
      if (error.name === 'MongoServerError' && error.code === 11000) {
        return res.status(409).json({ message: 'Duplicate field value' })
      }
  
      if (error.name === 'MongooseError') {
        return res.status(503).json({ message: 'Database connection error' })
      }
  
      res.status(500).json({ 
        message: 'Server error',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      })
    }
  },

  getUserById: async (req, res) => {
    try {
      const user = await User.findById(req.params.userId)
        .select('-password')
        .lean()

      if (!user) {
        return res.status(404).json({ message: 'User not found' })
      }

      res.status(200).json(user)
    } catch (error) {
      res.status(500).json({ message: 'Error fetching user profile' })
    }
  }
};

module.exports = {
  authMiddleware,
  authController,
};
