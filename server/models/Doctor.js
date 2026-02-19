const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  specialization: {
    type: String,
    required: [true, 'Please add specialization'],
  },
  experience: {
    type: Number,
    required: [true, 'Please add experience years'],
  },
  feesPerConsultation: {
    type: Number,
    required: [true, 'Please add consultation fees'],
  },
  department: {
    type: String,
    required: [true, 'Please add department'],
  },
  bio: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Doctor', doctorSchema);
