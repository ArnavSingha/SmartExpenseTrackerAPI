/**
 * Standardized API Error Code Identifiers
 * Using strict string enums rather than raw HTTP numeric codes provides
 * deterministic type-safety and superior client debuggability.
 */
export enum ErrorCode {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  RESOURCE_NOT_FOUND = 'RESOURCE_NOT_FOUND',
  MALFORMED_JSON = 'MALFORMED_JSON',
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  STORAGE_ERROR = 'STORAGE_ERROR',
}

/**
 * Universal Error Payload Contract
 * Guaranteed response structure for any failing request.
 */
export interface ApiErrorPayload {
  success: false;
  error: {
    code: string;
    message: string;
  };
}

/**
 * Universal Success Payload Contract
 * Guaranteed response structure for any successful request.
 */
export interface ApiSuccessPayload<T> {
  success: true;
  data: T;
  message?: string;
}

/**
 * Base abstract application error exception.
 * All domain failures inherit from this class to allow robust instanceof checks
 * in our centralized error middleware.
 */
export abstract class AppError extends Error {
  public abstract readonly statusCode: number;
  public abstract readonly code: ErrorCode | string;

  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Error thrown when input validation fails against domain rules or Zod schemas.
 */
export class ValidationError extends AppError {
  public readonly statusCode = 400;
  public readonly code = ErrorCode.VALIDATION_ERROR;

  constructor(message: string) {
    super(message);
  }
}

/**
 * Error thrown when a requested resource ID does not exist in storage.
 */
export class ResourceNotFoundError extends AppError {
  public readonly statusCode = 404;
  public readonly code = ErrorCode.RESOURCE_NOT_FOUND;

  constructor(message: string) {
    super(message);
  }
}

/**
 * Error thrown during unexpected system failures or filesystem IO failures.
 */
export class InternalServerException extends AppError {
  public readonly statusCode = 500;
  public readonly code = ErrorCode.INTERNAL_SERVER_ERROR;

  constructor(message: string = 'An internal system error occurred.') {
    super(message);
  }
}
