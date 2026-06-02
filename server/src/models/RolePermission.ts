import mongoose, { Schema } from 'mongoose';

const rolePermissionSchema = new Schema({
  role_id: { type: Schema.Types.ObjectId, ref: 'Role', required: true },
  permission_id: { type: Schema.Types.ObjectId, ref: 'Permission', required: true },
  permission_key: { type: String, required: true },
  effect: { type: String, enum: ['allow', 'deny'], default: 'allow' },
  assigned_by: { type: Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

rolePermissionSchema.index({ role_id: 1, permission_id: 1 }, { unique: true });

export const RolePermissionModel = mongoose.model('RolePermission', rolePermissionSchema);