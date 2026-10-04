import type { Request, Response, NextFunction } from 'express';
declare class PasswordResetController {
    /** POST /api/auth/forgot-password */
    forgotPassword(req: Request, res: Response, next: NextFunction): Promise<void>;
    /** POST /api/auth/reset-password */
    resetPassword(req: Request, res: Response, next: NextFunction): Promise<void>;
}
declare const _default: PasswordResetController;
export default _default;
//# sourceMappingURL=passwordReset.controller.d.ts.map