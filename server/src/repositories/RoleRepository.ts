import { BaseRepository } from "./BaseRepository";
import { RoleModel } from "../models/Role.model";

export class RoleRepository extends BaseRepository<any> {
  constructor() { super(RoleModel); }

  async findByKey(key: string) {
    return RoleModel.findOne({ key, status: 'active' });
  }

  async findAllActive() {
    return RoleModel.find({ status: 'active' }).select('name key role_type scope_level').sort('name');
  }
}
