import { Task } from '../models/Task';
import { UpdateTaskDTO } from '../dtos/TaskDTO';

/**
 * Repository Interface
 * Why use interfaces here? Dependency Inversion Principle (SOLID).
 * The service layer should depend on this interface, not the concrete implementation.
 */
export interface ITaskRepository {
    create(task: Task): Promise<Task>;
    findAll(): Promise<Task[]>;
    findById(id: string): Promise<Task | null>;
    update(id: string, updates: UpdateTaskDTO): Promise<Task | null>;
    delete(id: string): Promise<boolean>;
}
