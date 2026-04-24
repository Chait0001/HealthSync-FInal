import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
    try {
        const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/task-manager-oop';
        await mongoose.connect(uri);
        console.log('📦 MongoDB Connected Successfully');
    } catch (error) {
        console.error('❌ Database Connection Failed:', error);
        process.exit(1);
    }
};
