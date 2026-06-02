import { BaseRepository } from './BaseRepository';
import { IDoctor } from '../interfaces/IDoctor';
export declare class DoctorRepository extends BaseRepository<IDoctor> {
    constructor();
    findByUserId(userId: string): Promise<IDoctor | null>;
    findAllWithUserInfo(): Promise<IDoctor[]>;
    deleteByUserId(userId: string): Promise<boolean>;
}
//# sourceMappingURL=DoctorRepository.d.ts.map