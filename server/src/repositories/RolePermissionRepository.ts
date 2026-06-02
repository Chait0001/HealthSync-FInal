import { RolePermissionModel } from '../models/RolePermission';

export class RolePermissionRepository {
  async getPermissionsForRole(role_id: string): Promise<any> {
    return RolePermissionModel.find({ role_id, effect: 'allow' });
  }

  async getPermissionKeysForRoles(role_ids: string[]): Promise<string[]> {
    const docs = await RolePermissionModel.find({ role_id: { $in: role_ids }, effect: 'allow' });
    return [...new Set(docs.map(d => d.permission_key))];
  }

  async assignPermission(role_id: string, permission_id: string, permission_key: string, assigned_by: string): Promise<any> {
    return RolePermissionModel.findOneAndUpdate(
      { role_id, permission_id },
      { role_id, permission_id, permission_key, effect: 'allow', assigned_by },
      { upsert: true, new: true }
    );
  }

  async removePermission(role_id: string, permission_id: string): Promise<any> {
    return RolePermissionModel.deleteOne({ role_id, permission_id });
  }

  async setPermissionsForRole(role_id: string, permission_docs: { _id: string; key: string }[], assigned_by: string): Promise<any> {
    await RolePermissionModel.deleteMany({ role_id });
    const inserts = permission_docs.map(p => ({
      role_id, permission_id: p._id, permission_key: p.key, effect: 'allow', assigned_by
    }));
    return RolePermissionModel.insertMany(inserts);
  }
}