import type { Request, Response, NextFunction } from 'express';
declare class UploadController {
    getUsedImagesList(): Promise<string[]>;
    uploadProductImage(req: Request, res: Response, next: NextFunction): Promise<void>;
    uploadLogoImage(req: Request, res: Response, next: NextFunction): Promise<void>;
    uploadBannerImage(req: Request, res: Response, next: NextFunction): Promise<void>;
    uploadTestimonialImage(req: Request, res: Response, next: NextFunction): Promise<void>;
    getUsedImages: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    deleteImage: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
    listImages: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
declare const _default: UploadController;
export default _default;
//# sourceMappingURL=upload.controller.d.ts.map