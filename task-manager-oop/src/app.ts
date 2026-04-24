import express, { Application } from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import taskRoutes from './routes/taskRoutes';

// Load environment variables
dotenv.config();

// Connect to the database
connectDB();

const app: Application = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Register Routes
app.use('/api', taskRoutes);

// Base route for health check
app.get('/', (req, res) => {
    res.send('Task Management API is running. OOP Architecture is awesome!');
});

export default app;
