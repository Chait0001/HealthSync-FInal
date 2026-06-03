import { Request, Response, NextFunction } from 'express';
import { RoleService } from '../services/RoleService';
import { ApiResponse } from '../utils/ApiResponse';
import { AuthRequest } from '../middleware/auth.middleware';
import { RolePermissionModel } from '../models/RolePermission';

export class RoleController {
  constructor(private roleService: RoleService) {}

  getAllRoles = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const roles = await this.roleService.getAllRoles();
      res.json(ApiResponse.success(roles, 'Roles retrieved'));
    } catch (err) { next(err); }
  };

  getRoleWithPermissions = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const roleId = String(req.params.id);
      const role = await (this.roleService as any).roleRepo.findById(roleId);
      if (!role) {
        res.status(404).json(ApiResponse.error('Role not found', 404));
        return;
      }
      // Migrate legacy permissions if Map is empty
      if (!role.permissions || role.permissions.size === 0) {
        const rolePermissions = await RolePermissionModel.find({ role_id: roleId, effect: 'allow' });
        role.permissions = new Map();
        for (const rp of rolePermissions) {
          role.permissions.set(rp.permission_key, true);
        }
        await role.save();
      }
      const permissionsMap = Object.fromEntries(role.permissions);
      res.json(ApiResponse.success(permissionsMap, 'Role permissions map retrieved'));
    } catch (err) { next(err); }
  };

  setPermissionsForRole = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const roleId = String(req.params.id);
      const { permissionKey, value } = req.body;
      if (!permissionKey) {
        res.status(400).json(ApiResponse.error('permissionKey is required', 400));
        return;
      }

      const role = await (this.roleService as any).roleRepo.findById(roleId);
      if (!role) {
        res.status(404).json(ApiResponse.error('Role not found', 404));
        return;
      }

      if (!role.permissions) {
        role.permissions = new Map();
      }

      role.permissions.set(permissionKey, value);
      await role.save();

      // Emit socket event
      req.app.get('io')?.emit('permissions:updated', { roleId });

      // Refresh cache for all users with this role
      const users = await (this.roleService as any).userRepo.model.find({ role: role.key });
      for (const u of users) {
        const activePerms: string[] = [];
        for (const [k, v] of role.permissions.entries()) {
          if (v === true) activePerms.push(k);
        }
        await (this.roleService as any).userRepo.updatePermissionsCache(u._id.toString(), activePerms);
      }

      const permissionsMap = Object.fromEntries(role.permissions);
      res.json(ApiResponse.success(permissionsMap, 'Permission updated successfully'));
    } catch (err) { next(err); }
  };

  assignRoleToUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { role_key } = req.body;
      const keys = await this.roleService.assignRoleToUser(
        String(req.params.userId),
        role_key,
        req.user!._id.toString()
      );
      res.json(ApiResponse.success({ permissions_cache: keys }, 'Role assigned'));
    } catch (err) { next(err); }
  };

  createRole = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { key, name, role_type, scope_level } = req.body;
      const role = await this.roleService.createRole({ key, name, role_type, scope_level });
      res.status(201).json(ApiResponse.success(role, 'Role created'));
    } catch (err) { next(err); }
  };

  deleteRole = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.roleService.deleteRole(String(req.params.id));
      res.json(ApiResponse.success(result, 'Role deleted'));
    } catch (err) { next(err); }
  };

  getAllPermissions = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const permissions = await this.roleService.getAllPermissions();
      res.json(ApiResponse.success(permissions, 'Permissions retrieved'));
    } catch (err) { next(err); }
  };

  createPermission = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { key, name, module, action, category } = req.body;
      const perm = await this.roleService.createPermission({ key, name, module, action, category });
      res.status(201).json(ApiResponse.success(perm, 'Permission created'));
    } catch (err) { next(err); }
  };

  deletePermission = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.roleService.deletePermission(String(req.params.permId || req.params.id));
      res.json(ApiResponse.success(result, 'Permission deleted'));
    } catch (err) { next(err); }
  };
}