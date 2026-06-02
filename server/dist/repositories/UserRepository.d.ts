import { BaseRepository } from './BaseRepository';
import { IUser } from '../interfaces/IUser';
export declare class UserRepository extends BaseRepository<IUser> {
    constructor();
    /** Domain-specific query — finds user with password field included */
    findByEmail(email: string, withPassword?: boolean): Promise<IUser | null>;
    /** Fetch all users without password, newest first */
    findAllWithoutPassword(): Promise<IUser[]>;
    countByRole(role: string): Promise<number>;
    countAll(): Promise<number>;
}
//# sourceMappingURL=UserRepository.d.ts.map