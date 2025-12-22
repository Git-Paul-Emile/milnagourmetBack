import type { Request, Response, NextFunction } from 'express';
import { type AccessTokenPayload } from '../config/jwt.js';
declare global {
    namespace Express {
        interface Request {
            user?: AccessTokenPayload;
        }
    }
}
export declare const requireAdmin: (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=admin.middleware.d.ts.map