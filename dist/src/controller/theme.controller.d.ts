import type { Request, Response } from 'express';
export declare class ThemeController {
    getAllThemes(req: Request, res: Response): Promise<void>;
    getActiveTheme(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getThemeById(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    createTheme(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    updateTheme(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    setActiveTheme(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    setDefaultTheme(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    deleteTheme(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
}
declare const _default: ThemeController;
export default _default;
//# sourceMappingURL=theme.controller.d.ts.map