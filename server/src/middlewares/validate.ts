import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

export function validateBody<T>(schema: ZodSchema<T>) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      req.body = schema.parse(req.body) as T;
      next();
    } catch (err) {
      next(err instanceof ZodError ? err : new Error('Validation failed'));
    }
  };
}

export function validateQuery<T>(schema: ZodSchema<T>) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      // Express types require ParsedQs; we keep runtime value and cast.
      req.query = schema.parse(req.query) as any;
      next();
    } catch (err) {
      next(err instanceof ZodError ? err : new Error('Validation failed'));
    }
  };
}
