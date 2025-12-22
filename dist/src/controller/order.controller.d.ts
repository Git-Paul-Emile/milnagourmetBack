import type { Request, Response, NextFunction } from 'express';
declare class OrderController {
    create(req: Request, res: Response, next: NextFunction): Promise<void>;
    getAll(req: Request, res: Response, next: NextFunction): Promise<void>;
    getById(req: Request, res: Response, next: NextFunction): Promise<void>;
    getByUser(req: Request, res: Response, next: NextFunction): Promise<void>;
    updateStatus(req: Request, res: Response, next: NextFunction): Promise<void>;
}
declare const _default: OrderController;
export default _default;
//# sourceMappingURL=order.controller.d.ts.map