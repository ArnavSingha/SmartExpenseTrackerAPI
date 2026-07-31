import { Request, Response, NextFunction } from 'express';
import { AppError, ErrorCode, ApiErrorPayload } from '../models/api-error.model';

/**
 * Centralized Application Error Interceptor Middleware
 * Guarantees that every single error throughout the API lifecycle is formatted
 * strictly according to the required specification:
 * { success: false, error: { code: string, message: string } }
 *
 * Never leaks stack traces or unhandled internal structures to external clients.
 */
export const errorMiddleware = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  // Handle expected custom application domain exceptions
  if (err instanceof AppError) {
    const payload: ApiErrorPayload = {
      success: false,
      error: {
        code: err.code,
        message: err.message,
      },
    };
    res.status(err.statusCode).json(payload);
    return;
  }

  // Handle Express body-parser malformed JSON SyntaxErrors
  if (err.name === 'SyntaxError' && 'body' in err) {
    const payload: ApiErrorPayload = {
      success: false,
      error: {
        code: ErrorCode.MALFORMED_JSON,
        message: 'Request payload contains malformed or unparsable JSON.',
      },
    };
    res.status(400).json(payload);
    return;
  }

  // Handle unexpected internal system or runtime exceptions
  // Log full trace to server diagnostic output while shielding external API response
  console.error('[UNHANDLED EXCEPTION]', err);

  const payload: ApiErrorPayload = {
    success: false,
    error: {
      code: ErrorCode.INTERNAL_SERVER_ERROR,
      message: 'An unexpected internal server error occurred.',
    },
  };
  res.status(500).json(payload);
};
