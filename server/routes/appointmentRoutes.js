const express = require('express');
const router = express.Router();
const {
  getMyAppointments,
  bookAppointment,
} = require('../controllers/appointmentController');
const { protect } = require('../middleware/authMiddleware');

router.get('/my', protect, getMyAppointments);
router.post('/', protect, bookAppointment);

module.exports = router;
