import { BaseRepository } from './BaseRepository';
import { DoctorModel } from '../models/Doctor.model';
import { IDoctor } from '../interfaces/IDoctor';

export class DoctorRepository extends BaseRepository<IDoctor> {
  constructor() {
    super(DoctorModel);
  }

  async findByUserId(userId: string): Promise<IDoctor | null> {
    return this.model.findOne({ userId }).exec();
  }

  async findAllWithUserInfo(): Promise<IDoctor[]> {
    return this.model.find({}).populate('userId', 'name email').exec();
  }

  async deleteByUserId(userId: string): Promise<boolean> {
    const result = await this.model.findOneAndDelete({ userId }).exec();
    return !!result;
  }
}
