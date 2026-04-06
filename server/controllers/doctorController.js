const asyncHandler = require('express-async-handler');
const Doctor = require('../models/Doctor');

// @desc    Get all doctors
// @route   GET /api/doctors
// @access  Public
const getDoctors = asyncHandler(async (req, res) => {
  const doctors = await Doctor.find({}).populate('userId', 'name email');
  res.status(200).json(doctors);
});

module.exports = {
  getDoctors,
};
