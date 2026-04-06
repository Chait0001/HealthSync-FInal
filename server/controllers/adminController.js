const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Private (Admin)
const getStats = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments({});
  const totalDoctors = await User.countDocuments({ role: 'doctor' });
  const totalPatients = await User.countDocuments({ role: 'patient' });

  res.status(200).json({
    totalUsers,
    totalDoctors,
    totalPatients,
  });
});

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (Admin)
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select('-password').sort({ createdAt: -1 });
  res.status(200).json(users);
});

// @desc    Delete a user
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin)
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // If user is a doctor, delete their doctor profile too
  if (user.role === 'doctor') {
    await Doctor.findOneAndDelete({ userId: user._id });
  }
  
  // Try to delete their appointments
  await Appointment.deleteMany({ $or: [{ patientId: user._id }, { doctorId: user._id }] });

  await user.deleteOne();

  res.status(200).json({ message: 'User deleted' });
});

// @desc    Get pending appointments
// @route   GET /api/admin/appointments/pending
// @access  Private (Admin)
const getPendingAppointments = asyncHandler(async (req, res) => {
  const appointments = await Appointment.find({ status: 'pending' })
    .populate('patientId', 'name email')
    .populate({
      path: 'doctorId',
      populate: { path: 'userId', select: 'name email' }
    })
    .sort({ date: 1 });

  res.status(200).json(appointments);
});

// @desc    Get scheduled appointments
// @route   GET /api/admin/appointments/scheduled
// @access  Private (Admin)
const getScheduledAppointments = asyncHandler(async (req, res) => {
  const appointments = await Appointment.find({ status: 'approved' })
    .populate('patientId', 'name email')
    .populate({
      path: 'doctorId',
      populate: { path: 'userId', select: 'name email' }
    })
    .sort({ date: 1 });

  res.status(200).json(appointments);
});

// @desc    Approve an appointment
// @route   PUT /api/admin/appointments/:id/approve
// @access  Private (Admin)
const approveAppointment = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id);

  if (!appointment) {
    res.status(404);
    throw new Error('Appointment not found');
  }

  appointment.status = 'approved';
  const updatedAppointment = await appointment.save();

  res.status(200).json(updatedAppointment);
});

module.exports = {
  getStats,
  getUsers,
  deleteUser,
  getPendingAppointments,
  getScheduledAppointments,
  approveAppointment,
};
