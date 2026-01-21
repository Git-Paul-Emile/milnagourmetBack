import type { Request, Response, NextFunction } from 'express';
declare class LoyaltyController {
    getUserPoints(req: Request, res: Response, next: NextFunction): Promise<void>;
    getUserPointsHistory(req: Request, res: Response, next: NextFunction): Promise<void>;
    usePoints(req: Request, res: Response, next: NextFunction): Promise<void>;
    calculatePoints(req: Request, res: Response, next: NextFunction): Promise<void>;
}
declare const _default: LoyaltyController;
export default _default;
//# sourceMappingURL=loyalty.controller.d.ts.map