import { Request, Response } from 'express';
import { TaskManager } from '../services/TaskManager';
import { TaskRepository } from '../repositories/TaskRepository';
import { CreateTaskDTO, UpdateTaskDTO } from '../dtos/TaskDTO';
import { sendSuccess, sendError } from '../utils/responseHandler';

/**
 * Controller Layer
 * Responsibility: Extract data from requests (req.body, req.params) 
 * and pass it to the service layer. Then format the response.
 * No business logic should reside here!
 */

// Initialize repository and pass it to the Singleton Service
const taskRepository = new TaskRepository();
const taskManager = TaskManager.getInstance(taskRepository);

export class TaskController {
    
    public async createTask(req: Request, res: Response): Promise<void> {
        try {
            const dto: CreateTaskDTO = req.body;
            const task = await taskManager.createTask(dto);
            sendSuccess(res, 201, 'Task created successfully', task);
        } catch (error: any) {
            sendError(res, 400, error.message || 'Failed to create task');
        }
    }

    public async getAllTasks(req: Request, res: Response): Promise<void> {
        try {
            const tasks = await taskManager.getAllTasks();
            sendSuccess(res, 200, 'Tasks retrieved successfully', tasks);
        } catch (error: any) {
            sendError(res, 500, 'Failed to fetch tasks');
        }
    }

    public async getTaskById(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const task = await taskManager.getTaskById(id as string);
            if (!task) {
                sendError(res, 404, 'Task not found');
                return;
            }
            sendSuccess(res, 200, 'Task retrieved successfully', task);
        } catch (error: any) {
            sendError(res, 500, 'Failed to fetch task');
        }
    }

    public async updateTask(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const dto: UpdateTaskDTO = req.body;
            const updatedTask = await taskManager.updateTask(id as string, dto);
            
            if (!updatedTask) {
                sendError(res, 404, 'Task not found');
                return;
            }
            sendSuccess(res, 200, 'Task updated successfully', updatedTask);
        } catch (error: any) {
            sendError(res, 500, 'Failed to update task');
        }
    }

    public async deleteTask(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const success = await taskManager.deleteTask(id as string);
            
            if (!success) {
                sendError(res, 404, 'Task not found');
                return;
            }
            sendSuccess(res, 200, 'Task deleted successfully');
        } catch (error: any) {
            sendError(res, 500, 'Failed to delete task');
        }
    }
}
