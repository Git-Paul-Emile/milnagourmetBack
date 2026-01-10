import type { NextFunction, Request, Response } from 'express';
import type { ZodSchema } from 'zod';
import { AppError } from '../utils/AppError.js';
import { StatusCodes } from 'http-status-codes';

const validateResource = (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (e: any) {
    if (e.issues) {
       // Format Zod errors
      const errorMessage = e.issues.map((err: any) => err.message).join(', ');
      next(new AppError(errorMessage, StatusCodes.BAD_REQUEST));
    } else {
      next(e);
    }
  }
};

export default validateResource;
