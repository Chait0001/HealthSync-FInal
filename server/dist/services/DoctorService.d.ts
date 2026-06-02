import { IDoctorService, UpdateDoctorDTO } from '../interfaces/IServices';
import { IDoctor } from '../interfaces/IDoctor';
import { DoctorRepository } from '../repositories/DoctorRepository';
export declare class DoctorService implements IDoctorService {
    private readonly doctorRepo;
    constructor(doctorRepo: DoctorRepository);
    getAllDoctors(): Promise<IDoctor[]>;
    getDoctorByUserId(userId: string): Promise<IDoctor | null>;
    updateDoctorProfile(userId: string, data: UpdateDoctorDTO): Promise<IDoctor | null>;
}
//# sourceMappingURL=DoctorService.d.ts.map