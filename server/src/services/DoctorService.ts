import { IDoctorService, UpdateDoctorDTO } from '../interfaces/IServices';
import { IDoctor } from '../interfaces/IDoctor';
import { DoctorRepository } from '../repositories/DoctorRepository';
import { ApiError } from '../utils/ApiError';

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

  async updateDoctorProfile(userId: string, data: UpdateDoctorDTO): Promise<IDoctor | null> {
    const doctor = await this.doctorRepo.findByUserId(userId);
    if (!doctor) throw new ApiError('Doctor profile not found', 404);
    return this.doctorRepo.update(doctor._id.toString(), data as Partial<IDoctor>);
  }
}
