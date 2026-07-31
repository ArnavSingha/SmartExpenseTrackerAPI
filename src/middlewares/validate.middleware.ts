import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { ValidationError } from '../models/api-error.model';

/**
 * Interface configuring which request targets to validate against provided schemas.
 */
interface ValidationConfig {
  body?: ZodSchema;
  query?: ZodSchema;
  params?: ZodSchema;
}

/**
 * Generic Zod Schema Validation Interceptor
 * Intercepts inbound HTTP requests and applies runtime type-checking against defined domain schemas.
 * If validation fails, throws a clean domain ValidationError containing human-readable summaries.
 */
export const validate = (config: ValidationConfig) => {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      if (config.body) {
        req.body = await config.body.parseAsync(req.body);
      }
      if (config.query) {
        req.query = (await config.query.parseAsync(req.query)) as any;
      }
      if (config.params) {
        req.params = (await config.params.parseAsync(req.params)) as any;
      }
      next();
    } catch (error: any) {
      if (error instanceof ZodError) {
        // Concatenate issue messages into a clean, human-readable summary string
        const errorMessage = error.issues
          .map((issue) => {
            const path = issue.path.length > 0 ? `${issue.path.join('.')}: ` : '';
            return `${path}${issue.message}`;
          })
          .join(' ');
        
        return next(new ValidationError(errorMessage || 'Input validation failed against schema rules.'));
      }
      next(error);
    }
  };
};
