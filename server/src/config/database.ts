import mongoose from 'mongoose';
import { ApiError } from '../utils/ApiError';

/**
 * DatabaseConnection — Singleton class (SRP: only manages DB lifecycle).
 */
export class DatabaseConnection {
  private static instance: DatabaseConnection;
  private isConnected = false;

  private constructor() {}

  static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }

  async connect(): Promise<void> {
    if (this.isConnected) return;

    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new ApiError('MONGODB_URI is not defined in environment variables', 500, false);
    }

    try {
      const conn = await mongoose.connect(uri);
      this.isConnected = true;
      console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      console.error(`❌ MongoDB connection error: ${msg}`);
      process.exit(1);
    }
  }

  async disconnect(): Promise<void> {
    if (!this.isConnected) return;
    await mongoose.disconnect();
    this.isConnected = false;
    console.log('🔌 MongoDB Disconnected');
  }
}
