import type { Request, Response, NextFunction } from 'express';
declare class SiteController {
    getBranding(req: Request, res: Response, next: NextFunction): Promise<void>;
    updateBranding(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    getAvatarToast(req: Request, res: Response, next: NextFunction): Promise<void>;
    updateAvatarToast(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    getContact(req: Request, res: Response, next: NextFunction): Promise<void>;
    updateContact(req: Request, res: Response, next: NextFunction): Promise<void>;
    getSocialMedia(req: Request, res: Response, next: NextFunction): Promise<void>;
    updateSocialMedia(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    getTestimonials(req: Request, res: Response, next: NextFunction): Promise<void>;
    getAllTestimonials(req: Request, res: Response, next: NextFunction): Promise<void>;
    createTestimonial(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    updateTestimonial(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    deleteTestimonial(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    getHero(req: Request, res: Response, next: NextFunction): Promise<void>;
    updateHero(req: Request, res: Response, next: NextFunction): Promise<void>;
    getContactSection(req: Request, res: Response, next: NextFunction): Promise<void>;
    getCatalogSection(req: Request, res: Response, next: NextFunction): Promise<void>;
    updateCatalogSection(req: Request, res: Response, next: NextFunction): Promise<void>;
    getNavigation(req: Request, res: Response, next: NextFunction): Promise<void>;
    getStoreHours(req: Request, res: Response, next: NextFunction): Promise<void>;
    updateStoreHours(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
}
declare const _default: SiteController;
export default _default;
//# sourceMappingURL=site.controller.d.ts.map