import type { Request, Response, NextFunction } from 'express';
declare class DeliveryZoneController {
    getAll(req: Request, res: Response, next: NextFunction): Promise<void>;
    getAllActive(req: Request, res: Response, next: NextFunction): Promise<void>;
    getAllWithOrderCounts(req: Request, res: Response, next: NextFunction): Promise<void>;
    getById(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    create(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    update(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    delete(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
}
declare const _default: DeliveryZoneController;
export default _default;
//# sourceMappingURL=deliveryZone.controller.d.ts.map