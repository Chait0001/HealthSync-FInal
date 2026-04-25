import { BaseRepository } from './BaseRepository';
import { UserModel } from '../models/User.model';
import { IUser } from '../interfaces/IUser';

export class UserRepository extends BaseRepository<IUser> {
  constructor() {
    super(UserModel);
  }

  /** Domain-specific query — finds user with password field included */
  async findByEmail(email: string, withPassword = false): Promise<IUser | null> {
    const query = this.model.findOne({ email });
    return withPassword ? query.select('+password').exec() : query.exec();
  }

  /** Fetch all users without password, newest first */
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
