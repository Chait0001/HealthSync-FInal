import { Task } from '../models/Task';
import { ITaskRepository } from '../interfaces/ITaskRepository';
import { CreateTaskDTO, UpdateTaskDTO } from '../dtos/TaskDTO';

/**
 * Singleton Pattern for Service layer
 * Why Singleton? We only need one instance of the TaskManager service throughout the app.
 * It manages the business logic and orchestrates data flow.
 * Why Service Layer? To keep business logic separate from the controllers and repositories.
 */
export class TaskManager {
    private static instance: TaskManager;
    private repository: ITaskRepository;

    // Private constructor ensures the class cannot be instantiated directly from outside
    private constructor(repository: ITaskRepository) {
        this.repository = repository;
    }

    public static getInstance(repository: ITaskRepository): TaskManager {
        if (!TaskManager.instance) {
            TaskManager.instance = new TaskManager(repository);
        }
        return TaskManager.instance;
    }

    public async createTask(dto: CreateTaskDTO): Promise<Task> {
        // Validation logic
        if (!dto.title || !dto.title.trim()) {
            throw new Error("Task title is required.");
        }
        
        // Use Domain Model encapsulation
        const task = new Task(dto.title, dto.description);
        return await this.repository.create(task);
    }

    public async getAllTasks(): Promise<Task[]> {
        return await this.repository.findAll();
    }

    public async getTaskById(id: string): Promise<Task | null> {
        return await this.repository.findById(id);
    }

    public async updateTask(id: string, dto: UpdateTaskDTO): Promise<Task | null> {
        // Business logic could be added here (e.g. state transition checks)
        return await this.repository.update(id, dto);
    }

    public async deleteTask(id: string): Promise<boolean> {
        return await this.repository.delete(id);
    }
}
