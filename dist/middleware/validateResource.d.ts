import type { NextFunction, Request, Response } from 'express';
import type { ZodSchema } from 'zod';
declare const validateResource: (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => void;
export default validateResource;
//# sourceMappingURL=validateResource.d.ts.map