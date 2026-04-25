import { Router } from 'express';
import { AdminController } from '../controllers/AdminController';
import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';

export const createAdminRouter = (adminController: AdminController): Router => {
  const router = Router();

  // All admin routes require authentication + admin role (RBAC)
  router.use(authenticate, requireRole('admin'));

  router.get('/stats', adminController.getStats);
  router.get('/users', adminController.getAllUsers);
  router.delete('/users/:id', adminController.deleteUser);
  router.get('/appointments/pending', adminController.getPendingAppointments);
  router.get('/appointments/scheduled', adminController.getScheduledAppointments);
  router.put('/appointments/:id/approve', adminController.approveAppointment);

  return router;
};
