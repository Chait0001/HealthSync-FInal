import { Router } from 'express';
import { DoctorController } from '../controllers/DoctorController';
import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';

export const createDoctorRouter = (doctorController: DoctorController): Router => {
  const router = Router();

  router.get('/', doctorController.getAllDoctors);
  router.get('/me', authenticate, requireRole('doctor'), doctorController.getMyProfile);
  router.put('/me', authenticate, requireRole('doctor'), doctorController.updateMyProfile);

  return router;
};
