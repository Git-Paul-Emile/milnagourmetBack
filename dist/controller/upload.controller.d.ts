import type { Request, Response, NextFunction } from 'express';
declare class UploadController {
    getUsedImagesList(): Promise<string[]>;
    private handleUpload;
    uploadProductImage: (req: Request, res: Response, next: NextFunction) => void;
    uploadLogoImage: (req: Request, res: Response, next: NextFunction) => void;
    uploadBannerImage: (req: Request, res: Response, next: NextFunction) => void;
    uploadTestimonialImage: (req: Request, res: Response, next: NextFunction) => void;
    uploadCategoryImage: (req: Request, res: Response, next: NextFunction) => void;
    uploadFruitImage: (req: Request, res: Response, next: NextFunction) => void;
    uploadSauceImage: (req: Request, res: Response, next: NextFunction) => void;
    uploadCerealeImage: (req: Request, res: Response, next: NextFunction) => void;
    uploadAvatarToastImage: (req: Request, res: Response, next: NextFunction) => void;
    getUsedImages: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    deleteImage: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
    listImages: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
declare const _default: UploadController;
export default _default;
//# sourceMappingURL=upload.controller.d.ts.map