/**
 * ApiError — Custom operational error class.
 * isOperational = true means it is a known/expected error (e.g. 404, 400).
 * Unhandled errors will have isOperational = false and can be caught by the global handler.
 */
export declare class ApiError extends Error {
    readonly statusCode: number;
    readonly isOperational: boolean;
    constructor(message: string, statusCode?: number, isOperational?: boolean);
}
//# sourceMappingURL=ApiError.d.ts.map