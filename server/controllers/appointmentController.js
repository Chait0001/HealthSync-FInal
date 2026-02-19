const asyncHandler = require('express-async-handler');
const Appointment = require('../models/Appointment');
const User = require('../models/User');
const Doctor = require('../models/Doctor');

// @desc    Get my appointments
// @route   GET /api/appointments/my
// @access  Private
const getMyAppointments = asyncHandler(async (req, res) => {
  let appointments;

  if (req.user.role === 'patient') {
    appointments = await Appointment.find({ patientId: req.user.id })
      .populate({
        path: 'doctorId',
        populate: { path: 'userId', select: 'name' },
      })
      .sort({ date: 1 });
  } else if (req.user.role === 'doctor') {
    // Find doctor profile first
    const doctor = await Doctor.findOne({ userId: req.user.id });
    if (!doctor) {
      res.status(404);
      throw new Error('Doctor profile not found');
    }
    appointments = await Appointment.find({ doctorId: doctor._id })
      .populate('patientId', 'name email')
      .sort({ date: 1 });
  } else {
    // Admin sees all? Or nothing?
    appointments = [];
  }

  res.status(200).json(appointments);
});

// @desc    Book appointment
// @route   POST /api/appointments
// @access  Private (Patient)
const bookAppointment = asyncHandler(async (req, res) => {
  const { doctorId, date, reason } = req.body;

  if (!doctorId || !date || !reason) {
    res.status(400);
    throw new Error('Please add all fields');
  }

  const appointment = await Appointment.create({
    patientId: req.user.id,
    doctorId,
    date,
    reason,
  });

  res.status(201).json(appointment);
});

module.exports = {
  getMyAppointments,
  bookAppointment,
};
