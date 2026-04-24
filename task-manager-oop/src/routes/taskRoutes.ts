import { Router } from 'express';
import { TaskController } from '../controllers/TaskController';

const router = Router();
const taskController = new TaskController();

// Use arrow functions to maintain the correct "this" context inside controller methods
router.post('/tasks', (req, res) => taskController.createTask(req, res));
router.get('/tasks', (req, res) => taskController.getAllTasks(req, res));
router.get('/tasks/:id', (req, res) => taskController.getTaskById(req, res));
router.put('/tasks/:id', (req, res) => taskController.updateTask(req, res));
router.delete('/tasks/:id', (req, res) => taskController.deleteTask(req, res));

export default router;
