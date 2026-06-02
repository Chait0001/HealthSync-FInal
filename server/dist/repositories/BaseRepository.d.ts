import { Model, Document } from 'mongoose';
import { IRepository } from '../interfaces/IRepository';
/**
 * BaseRepository<T> — OCP: open for extension via subclassing, closed for modification.
 * Liskov: every subclass can replace BaseRepository<T> without breaking behavior.
 */
export declare abstract class BaseRepository<T extends Document> implements IRepository<T> {
    protected readonly model: Model<T>;
    constructor(model: Model<T>);
    findById(id: string): Promise<T | null>;
    findAll(filter?: object): Promise<T[]>;
    create(data: Partial<T>): Promise<T>;
    update(id: string, data: Partial<T>): Promise<T | null>;
    delete(id: string): Promise<boolean>;
}
//# sourceMappingURL=BaseRepository.d.ts.map