import type { Request, Response, NextFunction } from 'express';
import { type AccessTokenPayload } from '../config/jwt.js';
declare global {
    namespace Express {
        interface Request {
            user?: AccessTokenPayload;
        }
    }
}
export declare const authenticateToken: (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=auth.middleware.d.ts.map