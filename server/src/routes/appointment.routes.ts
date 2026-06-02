import { Router } from 'express';
import { AppointmentController } from '../controllers/AppointmentController';
import { authenticate } from '../middleware/auth.middleware';
import { requirePermission } from '../middleware/role.middleware';

export const createAppointmentRouter = (appointmentController: AppointmentController): Router => {
  const router = Router();

  router.get('/my', authenticate, appointmentController.getMyAppointments);
  router.post('/', authenticate, requirePermission('appointments.create'), appointmentController.bookAppointment);

  return router;
};
