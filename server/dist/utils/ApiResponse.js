"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiResponse = void 0;
/**
 * ApiResponse<T> — Standardized envelope for every API response.
 * Static factory methods keep call-sites clean and consistent.
 */
class ApiResponse {
    constructor(success, message, data, statusCode = 200) {
        this.success = success;
        this.message = message;
        this.data = data;
        this.statusCode = statusCode;
    }
    static success(data, message = 'Success', statusCode = 200) {
        return new ApiResponse(true, message, data, statusCode);
    }
    static error(message, statusCode = 500) {
        return new ApiResponse(false, message, undefined, statusCode);
    }
}
exports.ApiResponse = ApiResponse;
//# sourceMappingURL=ApiResponse.js.map