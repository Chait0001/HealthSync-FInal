import { IDoctorService, UpdateDoctorDTO } from '../interfaces/IServices';
import { IDoctor } from '../interfaces/IDoctor';
import { DoctorRepository } from '../repositories/DoctorRepository';
import { ApiError } from '../utils/ApiError';
import { UserModel } from '../models/User.model';

export class DoctorService implements IDoctorService {
  constructor(private readonly doctorRepo: DoctorRepository) {}

  async getAllDoctors(): Promise<IDoctor[]> {
    return this.doctorRepo.findAllWithUserInfo();
  }

  async getDoctorByUserId(userId: string): Promise<IDoctor | null> {
    const doctor = await this.doctorRepo.findByUserId(userId);
    if (!doctor) throw new ApiError('Doctor profile not found', 404);
    return doctor;
  }

  async getDoctorById(id: string): Promise<IDoctor | null> {
    const doctor = await this.doctorRepo.findByIdWithUserInfo(id);
    if (!doctor) throw new ApiError('Doctor profile not found', 404);
    return doctor;
  }

  async updateDoctorProfile(userId: string, data: UpdateDoctorDTO): Promise<IDoctor | null> {
    const doctor = await this.doctorRepo.findByUserId(userId);
    if (!doctor) throw new ApiError('Doctor profile not found', 404);

    if (data.name) {
      await UserModel.findByIdAndUpdate(userId, { name: data.name });
    }

    const updateData = { ...data };
    delete updateData.name;

    await this.doctorRepo.update(doctor._id.toString(), updateData as Partial<IDoctor>);
    return this.doctorRepo.findByUserId(userId);
  }
}
