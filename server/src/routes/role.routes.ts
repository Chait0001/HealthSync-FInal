import { Router } from 'express';
import { RoleController } from '../controllers/RoleController';
import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';

export const createRoleRouter = (roleController: RoleController): Router => {
  const router = Router();
  router.use(authenticate, requireRole('admin'));

  // Static routes MUST come before dynamic /:id routes
  router.get('/permissions/all',           roleController.getAllPermissions);
  router.post('/permissions',              roleController.createPermission);
  router.delete('/permissions/:permId',    roleController.deletePermission);
  router.put('/users/:userId/assign-role', roleController.assignRoleToUser);

  // Role CRUD
  router.get('/',                          roleController.getAllRoles);
  router.post('/',                         roleController.createRole);
  router.get('/:id/permissions',           roleController.getRoleWithPermissions);
  router.put('/:id/permissions',           roleController.setPermissionsForRole);
  router.delete('/:id',                    roleController.deleteRole);

  return router;
};