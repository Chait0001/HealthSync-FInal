/**
 * ApiResponse<T> — Standardized envelope for every API response.
 * Static factory methods keep call-sites clean and consistent.
 */
export class ApiResponse<T = unknown> {
  public readonly success: boolean;
  public readonly message: string;
  public readonly data?: T;
  public readonly statusCode: number;

  constructor(success: boolean, message: string, data?: T, statusCode = 200) {
    this.success = success;
    this.message = message;
    this.data = data;
    this.statusCode = statusCode;
  }

  static success<T>(data: T, message = 'Success', statusCode = 200): ApiResponse<T> {
    return new ApiResponse<T>(true, message, data, statusCode);
  }

  static error(message: string, statusCode = 500): ApiResponse<undefined> {
    return new ApiResponse<undefined>(false, message, undefined, statusCode);
  }
}
