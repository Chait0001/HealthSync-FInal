import { Router } from 'express';
import { AdminController } from '../controllers/AdminController';
import { authenticate } from '../middleware/auth.middleware';
import { requireRole, requirePermission } from '../middleware/role.middleware';

export const createAdminRouter = (adminController: AdminController): Router => {
  const router = Router();

  // Appointment listing — accessible to any authenticated user with ANY appointment permission
  // (custom-role staff like receptionists, lab assistants, etc.)
  router.get(
    '/appointments/pending',
    authenticate,
    requirePermission('appointments.view', 'appointments.approve', 'appointments.cancel'),
    adminController.getPendingAppointments
  );
  router.get(
    '/appointments/scheduled',
    authenticate,
    requirePermission('appointments.view', 'appointments.approve', 'appointments.cancel'),
    adminController.getScheduledAppointments
  );

  router.get('/users', authenticate, adminController.getAllUsers);

  // All remaining admin routes require authentication + admin role
  router.use(authenticate, requireRole('admin'));

  router.get('/stats', adminController.getStats);
  router.post('/users', adminController.createUser);
  router.delete('/users/:id', adminController.deleteUser);
  router.put('/appointments/:id/approve', adminController.approveAppointment);
  router.post('/appointments/:id/send-reminder', adminController.sendReminder);
  router.get('/roles', adminController.getAllRoles);
  router.get('/permissions', adminController.getAllPermissions);

  return router;
};

