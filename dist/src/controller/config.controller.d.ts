import type { Request, Response, NextFunction } from 'express';
declare class ConfigController {
    private configService;
    getAllConfig(req: Request, res: Response, next: NextFunction): Promise<void>;
    getOrderStatusConfig(req: Request, res: Response, next: NextFunction): Promise<void>;
    getCategoryTranslations(req: Request, res: Response, next: NextFunction): Promise<void>;
    getSizeTranslations(req: Request, res: Response, next: NextFunction): Promise<void>;
}
declare const _default: ConfigController;
export default _default;
//# sourceMappingURL=config.controller.d.ts.map