/**
 * ApiResponse<T> — Standardized envelope for every API response.
 * Static factory methods keep call-sites clean and consistent.
 */
export declare class ApiResponse<T = unknown> {
    readonly success: boolean;
    readonly message: string;
    readonly data?: T;
    readonly statusCode: number;
    constructor(success: boolean, message: string, data?: T, statusCode?: number);
    static success<T>(data: T, message?: string, statusCode?: number): ApiResponse<T>;
    static error(message: string, statusCode?: number): ApiResponse<undefined>;
}
//# sourceMappingURL=ApiResponse.d.ts.map