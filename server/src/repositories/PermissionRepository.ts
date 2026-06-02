import { BaseRepository } from './BaseRepository';
import { PermissionModel } from '../models/Permission.model';

export class PermissionRepository extends BaseRepository<any> {
  constructor() { super(PermissionModel); }

  async findByKey(key: string) {
    return PermissionModel.findOne({ key, status: 'active' });
  }

  async findByModule(module: string) {
    return PermissionModel.find({ module, status: 'active' });
  }

  async findAllActive() {
    return PermissionModel.find({ status: 'active' }).sort('module action');
  }
}
