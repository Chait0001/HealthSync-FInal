import { BaseRepository } from './BaseRepository';
import { UserModel } from '../models/User.model';
import { IUser } from '../interfaces/IUser';

export class UserRepository extends BaseRepository<IUser> {
  constructor() {
    super(UserModel);
  }

async assignRole(userId: string, roleData: { role_id: string; role_key: string; role_name: string }) {
  return UserModel.findByIdAndUpdate(
    userId,
    { $push: { roles: { ...roleData, is_primary: false, assigned_at: new Date() } } },
    { new: true }
  );
}

async updatePermissionsCache(userId: string, permissions: string[]) {
  return UserModel.findByIdAndUpdate(
    userId,
    { $set: { permissions_cache: permissions } },
    { new: true }
  );
}

async updateProfile(userId: string, updateData: any) {
  return UserModel.findByIdAndUpdate(
    userId,
    { $set: updateData },
    { new: true }
  ).select('-password');
}

  async findByEmail(email: string, withPassword = false): Promise<IUser | null> {
    const query = this.model.findOne({ email });
    return withPassword ? query.select('+password').exec() : query.exec();
  }

  async findAllWithoutPassword(): Promise<IUser[]> {
    return this.model.find({}).select('-password').sort({ createdAt: -1 }).exec();
  }

  async countByRole(role: string): Promise<number> {
    return this.model.countDocuments({ role });
  }

  async countAll(): Promise<number> {
    return this.model.countDocuments({});
  }
}
