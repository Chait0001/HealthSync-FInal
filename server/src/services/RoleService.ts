import { RoleRepository } from '../repositories/RoleRepository';
import { PermissionRepository } from '../repositories/PermissionRepository';
import { RolePermissionRepository } from '../repositories/RolePermissionRepository';
import { UserRepository } from '../repositories/UserRepository';
import { ApiError } from '../utils/ApiError';

export class RoleService {
  constructor(
    private roleRepo: RoleRepository,
    private permRepo: PermissionRepository,
    private rolePerm: RolePermissionRepository,
    private userRepo: UserRepository,
  ) {}

  async getAllRoles() {
    return this.roleRepo.findAllActive();
  }

  async getRoleWithPermissions(roleId: string) {
    const role = await this.roleRepo.findById(roleId);
    if (!role) throw new ApiError('Role not found', 404);
    const permissions = await this.rolePerm.getPermissionsForRole(roleId);
    return { role, permissions };
  }

  async setPermissionsForRole(roleId: string, permissionKeys: string[], adminId: string) {
    const perms = await Promise.all(permissionKeys.map(k => this.permRepo.findByKey(k)));
    const validPerms = perms.filter(Boolean) as any[];
    await this.rolePerm.setPermissionsForRole(roleId, validPerms.map(p => ({ _id: p._id.toString(), key: p.key })), adminId);
    return this.getRoleWithPermissions(roleId);
  }

  // Rebuild permissions_cache for a single user based on their roles
  async refreshUserPermissionsCache(userId: string) {
    const user = await this.userRepo.findById(userId) as any;
    if (!user) throw new ApiError('User not found', 404);
    const roleIds = user.roles?.map((r: any) => r.role_id?.toString()) ?? [];
    if (user.role && roleIds.length === 0) {
      // Backward compat: user has old role string but no roles array yet
      const role = await this.roleRepo.findByKey(user.role);
      if (role) roleIds.push(role._id.toString());
    }
    const keys = await this.rolePerm.getPermissionKeysForRoles(roleIds);
    await this.userRepo.updatePermissionsCache(userId, keys);
    return keys;
  }

  async assignRoleToUser(userId: string, roleKey: string, adminId: string) {
    const role = await this.roleRepo.findByKey(roleKey);
    if (!role) throw new ApiError(`Role '${roleKey}' not found`, 404);
    await this.userRepo.assignRole(userId, {
      role_id: role._id.toString(),
      role_key: role.key,
      role_name: role.name,
    });
    // Also update the legacy role field
    await (this.userRepo as any).model?.findByIdAndUpdate(userId, { role: roleKey });
    return this.refreshUserPermissionsCache(userId);
  }
}