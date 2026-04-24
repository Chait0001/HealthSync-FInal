import { Document, Schema, model } from 'mongoose';
import { Task } from '../models/Task';
import { ITaskRepository } from '../interfaces/ITaskRepository';
import { UpdateTaskDTO } from '../dtos/TaskDTO';

/**
 * Mongoose Document Interface
 */
interface ITaskDocument extends Document {
    title: string;
    description: string;
    completed: boolean;
    createdAt: Date;
}

/**
 * Mongoose Schema
 */
const TaskSchema = new Schema<ITaskDocument>({
    title: { type: String, required: true },
    description: { type: String, required: true },
    completed: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

const TaskModelDB = model<ITaskDocument>('Task', TaskSchema);

/**
 * Repository Pattern Implementation
 * Why use this pattern? It abstracts the database layer. The rest of the application
 * (services, controllers) only deals with pure Domain Models (the Task class) and
 * knows nothing about Mongoose or MongoDB. This achieves Separation of Concerns.
 */
export class TaskRepository implements ITaskRepository {
    
    // Helper to map a Mongoose document to our pure Domain Model
    private mapToDomain(doc: any): Task {
        return new Task(
            doc.title,
            doc.description,
            doc.completed,
            doc._id.toString(),
            doc.createdAt
        );
    }

    public async create(task: Task): Promise<Task> {
        const newTask = new TaskModelDB({
            title: task.getTitle(),
            description: task.getDescription(),
            completed: task.isCompleted(),
            createdAt: task.getCreatedAt()
        });
        const savedTask = await newTask.save();
        return this.mapToDomain(savedTask);
    }

    public async findAll(): Promise<Task[]> {
        const tasks = await TaskModelDB.find().exec();
        return tasks.map(task => this.mapToDomain(task));
    }

    public async findById(id: string): Promise<Task | null> {
        const task = await TaskModelDB.findById(id).exec();
        if (!task) return null;
        return this.mapToDomain(task);
    }

    public async update(id: string, updates: UpdateTaskDTO): Promise<Task | null> {
        const updatedDoc = await TaskModelDB.findByIdAndUpdate(
            id, 
            { $set: updates }, 
            { new: true }
        ).exec();
        if (!updatedDoc) return null;
        return this.mapToDomain(updatedDoc);
    }

    public async delete(id: string): Promise<boolean> {
        const result = await TaskModelDB.findByIdAndDelete(id).exec();
        return result !== null;
    }
}
