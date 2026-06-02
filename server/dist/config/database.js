"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseConnection = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const ApiError_1 = require("../utils/ApiError");
/**
 * DatabaseConnection — Singleton class (SRP: only manages DB lifecycle).
 */
class DatabaseConnection {
    constructor() {
        this.isConnected = false;
    }
    static getInstance() {
        if (!DatabaseConnection.instance) {
            DatabaseConnection.instance = new DatabaseConnection();
        }
        return DatabaseConnection.instance;
    }
    async connect() {
        if (this.isConnected)
            return;
        const uri = process.env.MONGODB_URI;
        if (!uri) {
            throw new ApiError_1.ApiError('MONGODB_URI is not defined in environment variables', 500, false);
        }
        try {
            const conn = await mongoose_1.default.connect(uri);
            this.isConnected = true;
            console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        }
        catch (error) {
            const msg = error instanceof Error ? error.message : String(error);
            console.error(`❌ MongoDB connection error: ${msg}`);
            process.exit(1);
        }
    }
    async disconnect() {
        if (!this.isConnected)
            return;
        await mongoose_1.default.disconnect();
        this.isConnected = false;
        console.log('🔌 MongoDB Disconnected');
    }
}
exports.DatabaseConnection = DatabaseConnection;
//# sourceMappingURL=database.js.map