import { Router } from 'express';
import { AppointmentController } from '../controllers/AppointmentController';
import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';

export const createAppointmentRouter = (appointmentController: AppointmentController): Router => {
  const router = Router();

  router.get('/my', authenticate, appointmentController.getMyAppointments);
  router.post('/', authenticate, requireRole('patient'), appointmentController.bookAppointment);

  return router;
};
