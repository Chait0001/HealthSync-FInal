/**
 * DatabaseConnection — Singleton class (SRP: only manages DB lifecycle).
 */
export declare class DatabaseConnection {
    private static instance;
    private isConnected;
    private constructor();
    static getInstance(): DatabaseConnection;
    connect(): Promise<void>;
    disconnect(): Promise<void>;
}
//# sourceMappingURL=database.d.ts.map