const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Doctor = require('../models/Doctor');

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  console.log('Registering user:', req.body.email);
  const { name, email, password, role, ...otherDetails } = req.body;

  if (!name || !email || !password) {
    console.log('Missing fields:', { name: !!name, email: !!email, password: !!password });
    res.status(400);
    throw new Error('Please add all fields');
  }

  // Check if user exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    console.log('User already exists:', email);
    res.status(400);
    throw new Error('User already exists');
  }

  // Create user
  try {
    const user = await User.create({
      name,
      email,
      password, // Hashing handled in model hook
      role: role || 'patient',
      ...otherDetails, // age, gender, etc for patients
    });

    if (user) {
      console.log('User created:', user._id);
      // If role is doctor, create doctor profile
      if (role === 'doctor') {
        console.log('Creating doctor profile...');
        await Doctor.create({
          userId: user._id,
          specialization: otherDetails.specialization,
          experience: otherDetails.experience,
          feesPerConsultation: otherDetails.feesPerConsultation,
          department: otherDetails.department,
          bio: otherDetails.bio,
        });
        console.log('Doctor profile created');
      }

      res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      console.log('User creation failed - no user returned');
      res.status(400);
      throw new Error('Invalid user data');
    }
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(400);
    throw new Error(error.message || 'Registration failed');
  }
});

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check for user email
  const user = await User.findOne({ email }).select('+password');

  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid credentials');
  }
});

// @desc    Get user data
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  res.status(200).json(req.user);
});

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
};
