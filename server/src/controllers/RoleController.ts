import { Request, Response, NextFunction } from 'express';
import { RoleService } from '../services/RoleService';
import { ApiResponse } from '../utils/ApiResponse';
import { AuthRequest } from '../middleware/auth.middleware';

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
      const data = await this.roleService.getRoleWithPermissions(String(req.params.id));
      res.json(ApiResponse.success(data, 'Role permissions retrieved'));
    } catch (err) { next(err); }
  };

  setPermissionsForRole = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { permission_keys } = req.body; // string[]
      const data = await this.roleService.setPermissionsForRole(
        String(req.params.id),
        permission_keys,
        req.user!._id.toString()
      );
      res.json(ApiResponse.success(data, 'Permissions updated'));
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
}