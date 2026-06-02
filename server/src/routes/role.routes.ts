import { Router } from 'express';
import { RoleController } from '../controllers/RoleController';
import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';

export const createRoleRouter = (roleController: RoleController): Router => {
  const router = Router();
  router.use(authenticate, requireRole('admin'));

  router.get('/',                          roleController.getAllRoles);
  router.get('/:id/permissions',           roleController.getRoleWithPermissions);
  router.put('/:id/permissions',           roleController.setPermissionsForRole);
  router.put('/users/:userId/assign-role', roleController.assignRoleToUser);

  return router;
};