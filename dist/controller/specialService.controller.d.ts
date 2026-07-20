import type { Request, Response, NextFunction } from 'express';
declare class SpecialServiceController {
    getActive(req: Request, res: Response, next: NextFunction): Promise<void>;
    getAll(req: Request, res: Response, next: NextFunction): Promise<void>;
    update(req: Request, res: Response, next: NextFunction): Promise<void>;
    addComposant(req: Request, res: Response, next: NextFunction): Promise<void>;
    updateComposant(req: Request, res: Response, next: NextFunction): Promise<void>;
    deleteComposant(req: Request, res: Response, next: NextFunction): Promise<void>;
}
declare const _default: SpecialServiceController;
export default _default;
//# sourceMappingURL=specialService.controller.d.ts.map